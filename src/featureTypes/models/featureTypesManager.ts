import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { ConflictError, NotFoundError } from '@map-colonies/error-types';
import { withSpanAsyncV4 } from '@map-colonies/telemetry';
import { SERVICES } from '../../common/constants';
import {  IConfig } from '../../common/interfaces';
import { GeoserverClient } from '../../serviceClients/geoserverClient';


@injectable()
export class FeatureTypesManager {

  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer,
    private readonly geoserverManager: GeoserverClient
  ) {
  }

  @withSpanAsyncV4
  public async getFeatureTypes(workspaceName: string, dataStoreName: string): Promise<void> {

  }

  @withSpanAsyncV4
  public async getFeatureType(workspaceName: string, dataStoreName: string, featureTypeName: string): Promise<void> {

  }

  @withSpanAsyncV4
  public async deleteFeatureType(workspaceName: string, dataStoreName: string, featureTypeName: string, isRecursive: boolean): Promise<void> {
  }

  @withSpanAsyncV4
  public async createFeatureType(name: string): Promise<void> {
  
  }

  @withSpanAsyncV4
  public async updateFeatureTypes(oldName: string, newName: string): Promise<void> {
    
  }


}
