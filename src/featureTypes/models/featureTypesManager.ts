import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { withSpanAsyncV4 } from '@map-colonies/telemetry';
import { ConflictError, UnprocessableEntityError } from '@map-colonies/error-types';
import { SERVICES } from '../../common/constants';
import { FeatureTypeBodyRequest, GeoServerDeleteReqParams, GetFeatureTypeResponse, GetFeatureTypesResponse, IConfig } from '../../common/interfaces';
import { GeoserverClient } from '../../serviceClients/geoserverClient';
import {
  GeoServerCreateFeatureRequest,
  GeoserverFeatureTypeResponse,
  GeoserverGetConfiguredFeatureTypesResponse,
  GeoserverGetFeatureTypesResponse,
} from '../../common/geoserver/models/featureType';
import { featureTypeResponseConverter, featureTypesResponseConverter } from '../../utils/convertors/responseConverter';
import { postFeatureTypeRequestConverter } from '../../utils/convertors/requestConverter';
import { ListEnum } from '../../common/enums';

@injectable()
export class FeatureTypesManager {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer,
    private readonly geoserverManager: GeoserverClient
  ) {}

  @withSpanAsyncV4
  public async getFeatureTypes(workspaceName: string, dataStoreName: string, list: ListEnum): Promise<GetFeatureTypesResponse> {
    this.logger.info({
      msg: `getting ${list} featureTypes from workspace: ${workspaceName}, dataStore: ${dataStoreName}`,
      workspaceName,
      dataStoreName,
      list,
    });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoserverGetFeatureTypesResponse | GeoserverGetConfiguredFeatureTypesResponse>(
      `workspaces/${workspaceName}/datastores/${dataStoreName}/featuretypes`,
      { queryParams: { list } }
    );
    const response = featureTypesResponseConverter(geoserverResponse, list);
    return response;
  }

  @withSpanAsyncV4
  public async getFeatureType(workspaceName: string, dataStoreName: string, featureTypeName: string): Promise<GetFeatureTypeResponse> {
    this.logger.info({
      msg: `getting featureType: ${featureTypeName} in dataStore: ${dataStoreName} from workspace: ${workspaceName}`,
      workspaceName,
      dataStoreName,
      featureTypeName,
    });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoserverFeatureTypeResponse>(
      `workspaces/${workspaceName}/datastores/${dataStoreName}/featuretypes/${featureTypeName}`
    );
    const response = featureTypeResponseConverter(geoserverResponse);
    return response;
  }

  @withSpanAsyncV4
  public async deleteFeatureType(workspaceName: string, dataStoreName: string, featureTypeName: string, isRecursive: boolean): Promise<void> {
    this.logger.info({
      msg: `deleteing featureType: ${featureTypeName} in datsStore: ${dataStoreName} from workspace: ${workspaceName}`,
      workspaceName,
      dataStoreName,
      featureTypeName,
      isRecursive,
    });
    await this.geoserverManager.deleteRequest<GeoServerDeleteReqParams>(
      `workspaces/${workspaceName}/datastores/${dataStoreName}/featuretypes/${featureTypeName}`,
      {
        queryParams: { recurse: isRecursive },
      }
    );
  }

  @withSpanAsyncV4
  public async createFeatureType(workspaceName: string, dataStoreName: string, featureTypeBodyRequest: FeatureTypeBodyRequest): Promise<void> {
    this.logger.info({
      msg: `creating new feature :${featureTypeBodyRequest.nativeName} in dataStore:${dataStoreName} in workspace: ${workspaceName}`,
      workspaceName,
      dataStoreName,
      featureTypeBodyRequest,
    });
    const tableName = featureTypeBodyRequest.nativeName;
    //check that there is a table under the native_name provided
    const tableExists = await this.checkFeature(workspaceName, dataStoreName, tableName, ListEnum.ALL);
    if (!tableExists) {
      const errorMessage = `there is no table name : ${tableName} in workspace: ${workspaceName} in dataStore: ${dataStoreName}`;
      this.logger.error({
        msg: errorMessage,
      });
      throw new UnprocessableEntityError(errorMessage);
    }
    const createFeatureRequestBody = postFeatureTypeRequestConverter(featureTypeBodyRequest);
    const featureName = createFeatureRequestBody.featureType.name;
    //check conflict in given layer name - not mandatory but we want to throw 409 and not general 500 as geoserver throws
    const nameExists = await this.checkFeature(workspaceName, dataStoreName, featureName, ListEnum.CONFIGURED);
    if (nameExists) {
      const errorMessage = `there is already a configured feature named: ${featureName} in workspace: ${workspaceName} in dataStore: ${dataStoreName}`;
      this.logger.error({
        msg: errorMessage,
      });
      throw new ConflictError(errorMessage);
    }
    await this.geoserverManager.postRequest<GeoServerCreateFeatureRequest>(
      `workspaces/${workspaceName}/datastores/${dataStoreName}/featuretypes`,
      createFeatureRequestBody
    );
  }

  private async checkFeature(workspaceName: string, dataStoreName: string, name: string, list: ListEnum): Promise<boolean> {
    try {
      const featureTypesList = await this.getFeatureTypes(workspaceName, dataStoreName, list);
      return featureTypesList.some((feature) => feature.name === name);
    } catch (e) {
      this.logger.error({
        msg: `some error occurred while checking if table exists in workspace: ${workspaceName} in dataStore: ${dataStoreName}`,
      });
      throw e;
    }
  }
}
