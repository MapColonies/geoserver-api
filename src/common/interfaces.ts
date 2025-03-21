import { ListParam, WfsServiceLevel } from './enums';
import { GeoserverGetDataStoreResponse } from './geoserver/models/dataStore';
import { GeoserverFeatureTypeResponse } from './geoserver/models/featureType';
import { GeoserverGetWorkspaceResponse } from './geoserver/models/workspace';

export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
}

export interface OpenApiConfig {
  filePath: string;
  basePath: string;
  jsonPath: string;
  uiPath: string;
}

export interface Workspace {
  name: string;
  link: string;
}

export interface WorkspaceRequest {
  name: string;
}

export type GetWorkspaceResponse = Pick<GeoserverGetWorkspaceResponse['workspace'], 'name' | 'dateCreated'>;

export interface MessageResponse {
  message: string;
}

export interface DeleteQueryParams {
  isRecursive: boolean;
}

export type GetWorkspacesResponse = Workspace[];

export interface UpdateWorkspaceRequest extends WorkspaceRequest {
  newName: string;
}

export interface DataStoresRequest {
  workspaceName: string;
}

export interface DataStore extends Workspace {}

export type GetDataStoresResponse = DataStore[];

export interface DataStoreRequest extends DataStoresRequest {
  dataStoreName: string;
}

export type GetDataStoreResponse = Pick<GeoserverGetDataStoreResponse['dataStore'], 'name' | 'dateCreated'> & {
  host: string;
  port: string;
  schema: string;
  dbType: string;
  dbName: string;
  sslMode: string;
};

export interface DataStoreBodyRequest {
  name: string;
}

export interface ConnectionParams {
  username: string;
  password?: string;
  host: string;
  port: string;
  schema: string;
  dbType: string;
  dbName: string;
  sslMode: string;
}

export interface GeoServerDeleteReqParams extends Record<string, unknown> {
  recurse: boolean;
}

export interface FeatureType {
  name: string;
  link?: string;
}

export interface FeatureTypesRequest extends DataStoreRequest {}

export interface FeatureTypeRequest extends FeatureTypesRequest {
  featureTypeName: string;
}

export interface GetFeatureTypesQueryParams {
  list: ListParam;
}

export type GetFeatureTypesResponse = FeatureType[];

export type GetFeatureTypeResponse = Pick<GeoserverFeatureTypeResponse['featureType'], 'name' | 'enabled' | 'srs' | 'maxFeatures' | 'attributes'> & {
  tableName: string; //native name is table name
};

export interface FeatureTypeBodyRequest {
  nativeName: string; // table name
  name?: string; // display name
}

export interface WfsSettings {
  serviceLevel: WfsServiceLevel;
  maxFeatures?: number;
}
