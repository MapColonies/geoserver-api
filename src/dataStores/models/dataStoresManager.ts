import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { ConflictError, NotFoundError } from '@map-colonies/error-types';
import { withSpanAsyncV4 } from '@map-colonies/telemetry';
import { SERVICES } from '../../common/constants';
import { DataStoreBodyRequest, DataStore, GetDataStoreResponse, IConfig, ConnectionParams, GeoServerDeleteReqParams } from '../../common/interfaces';
import { GeoserverClient } from '../../serviceClients/geoserverClient';
import {
  GeoServerCreateDataStoreRequest,
  GeoserverGetDataStoreResponse,
  GeoserverGetDataStoresResponse,
  GeoServerUpdateDataStoreRequest,
} from '../../common/geoserver/models/dataStore';
import { dataStoreResponseConverter, dataStoresResponseConverter } from '../../utils/convertors/responseConverter';
import { postDataStoreRequestConverter, updateDataStoreRequestConverter } from '../../utils/convertors/requestConverter';
import { WorkspacesManager } from '../../workspaces/models/workspacesManager';

@injectable()
export class DataStoresManager {
  private readonly connectionParams: ConnectionParams;

  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer,
    private readonly geoserverManager: GeoserverClient,
    private readonly workspacesManager: WorkspacesManager
  ) {
    this.connectionParams = this.config.get<ConnectionParams>('geoserver.dataStore');
  }

  @withSpanAsyncV4
  public async getDataStores(workspaceName: string): Promise<DataStore[]> {
    this.logger.info({ msg: `getting dataStores from workspace: ${workspaceName}`, workspaceName });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoserverGetDataStoresResponse>(`workspaces/${workspaceName}/datastores`);
    const response = dataStoresResponseConverter(geoserverResponse);
    return response;
  }

  @withSpanAsyncV4
  public async getDataStore(workspaceName: string, dataStoreName: string): Promise<GetDataStoreResponse> {
    this.logger.info({ msg: `getting dataStore: ${dataStoreName} from workspace: ${workspaceName}`, workspaceName, dataStoreName });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoserverGetDataStoreResponse>(
      `workspaces/${workspaceName}/datastores/${dataStoreName}`
    );
    const response = dataStoreResponseConverter(geoserverResponse.dataStore);
    return response;
  }

  @withSpanAsyncV4
  public async deleteDataStore(workspaceName: string, dataStoreName: string, isRecursive: boolean): Promise<void> {
    this.logger.info({ msg: `deleteing dataStore: ${dataStoreName} from workspace: ${workspaceName}`, workspaceName, dataStoreName, isRecursive });
    await this.geoserverManager.deleteRequest<GeoServerDeleteReqParams>(`workspaces/${workspaceName}/datastores/${dataStoreName}`, {
      queryParams: { recurse: isRecursive },
    });
  }

  @withSpanAsyncV4
  public async createDataStore(workspaceName: string, createDataStoreBody: DataStoreBodyRequest): Promise<void> {
    this.logger.info({
      msg: `creating new dataStore named:${createDataStoreBody.name} in workspace: ${workspaceName}`,
      workspaceName,
      createDataStoreBody,
    });
    const dataStoreName = createDataStoreBody.name;
    //test if workspace exists
    await this.checkWorkspace(workspaceName);
    //test conflict
    const doesDataStoreExist = await this.checkDataStore(workspaceName, dataStoreName);
    if (doesDataStoreExist) {
      const errorMessage = `Cant create new dataStore in ${workspaceName} named ${dataStoreName}, there is already a dataStore under this name`;
      this.logger.error({ msg: errorMessage });
      throw new ConflictError(errorMessage);
    }
    const convertedCreateDataStoreBody = postDataStoreRequestConverter(createDataStoreBody, this.connectionParams);
    await this.geoserverManager.postRequest<GeoServerCreateDataStoreRequest>(`workspaces/${workspaceName}/datastores`, convertedCreateDataStoreBody);
  }

  @withSpanAsyncV4
  public async updateDataStore(workspaceName: string, dataStoreName: string, updateRequest: DataStoreBodyRequest): Promise<void> {
    this.logger.info({ msg: `updating dataStore: ${dataStoreName} from workspace: ${workspaceName}`, workspaceName, dataStoreName, updateRequest });
    //test if workspace exists
    await this.checkWorkspace(workspaceName);
    const doesNewDataStoreExist = await this.checkDataStore(workspaceName, updateRequest.name);
    if (doesNewDataStoreExist) {
      const errorMessage = `Cant change dataStore in ${workspaceName} named ${dataStoreName} to ${updateRequest.name}, there is already a dataStore under this name`;
      this.logger.error({ msg: errorMessage });
      throw new ConflictError(errorMessage);
    }
    const updatedDataStore = updateDataStoreRequestConverter(updateRequest);
    await this.geoserverManager.putRequest<GeoServerUpdateDataStoreRequest>(
      `workspaces/${workspaceName}/datastores/${dataStoreName}`,
      updatedDataStore
    );
  }

  @withSpanAsyncV4
  private async checkDataStore(workspaceName: string, dataStoreName: string): Promise<boolean> {
    try {
      await this.getDataStore(workspaceName, dataStoreName);
      return true;
    } catch (e) {
      return false;
    }
  }

  @withSpanAsyncV4
  private async checkWorkspace(workspaceName: string): Promise<void> {
    try {
      await this.workspacesManager.getWorkspace(workspaceName);
    } catch (e) {
      if (e instanceof NotFoundError) {
        e.message = `There is no workspace: ${workspaceName}`;
      }
      throw e;
    }
  }
}
