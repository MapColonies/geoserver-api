import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { ConflictError, NotFoundError } from '@map-colonies/error-types';
import { withSpanAsyncV4 } from '@map-colonies/telemetry';
import { SERVICES } from '../../common/constants';
import { GetFeatureTypesResponse, IConfig } from '../../common/interfaces';
import { GeoserverClient } from '../../serviceClients/geoserverClient';
import { GeoserverGetFeatureTypesResponse } from '../../common/geoserver/models/featureType';
import { dataStoresResponseConverter, featureTypesResponseConverter } from '../../utils/convertors/responseConverter';

@injectable()
export class FeatureTypesManager {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer,
    private readonly geoserverManager: GeoserverClient
  ) {}

  @withSpanAsyncV4
  public async getFeatureTypes(workspaceName: string, dataStoreName: string, list: string): Promise<GetFeatureTypesResponse> {
    this.logger.info({
      msg: `getting ${list} featureTypes from workspace: ${workspaceName}, dataStore: ${dataStoreName}`,
      workspaceName,
      dataStoreName,
      list,
    });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoserverGetFeatureTypesResponse>(
      `workspaces/${workspaceName}/datastores/${dataStoreName}/featuretypes`,
      { queryParams: { list } }
    );
    const response = featureTypesResponseConverter(geoserverResponse);
    return response;
  }

  @withSpanAsyncV4
  public async getFeatureType(workspaceName: string, dataStoreName: string, featureTypeName: string): Promise<unknown> {
    this.logger.info({ msg: `getting featureType: ${featureTypeName} in dataStore: ${dataStoreName} from workspace: ${workspaceName}`, workspaceName, dataStoreName,featureTypeName });
    const geoserverResponse = await this.geoserverManager.getRequest<unknown>(
      `workspaces/${workspaceName}/datastores/${dataStoreName}/featuretypes/${featureTypeName}`
    );
    //const response = dataStoreResponseConverter(geoserverResponse.dataStore);
    return geoserverResponse;
  }

  @withSpanAsyncV4
  public async deleteFeatureType(workspaceName: string, dataStoreName: string, featureTypeName: string, isRecursive: boolean): Promise<void> {}

  @withSpanAsyncV4
  public async createFeatureType(name: string): Promise<void> {}

  @withSpanAsyncV4
  public async updateFeatureTypes(oldName: string, newName: string): Promise<void> {}
}
