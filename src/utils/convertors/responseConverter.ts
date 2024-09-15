import { GeoserverGetDataStoreResponse, GeoserverGetDataStoresResponse } from '../../common/geoserver/models/dataStore';
import { GeoserverGetWorkspacesResponse } from '../../common/geoserver/models/workspace';
import { DataStore, GetDataStoreResponse, Workspace } from '../../common/interfaces';

/* This file contains functions that converts outputs from the Geo server to the response output the api expects to receive */
export const workspaceResponseConverter = (geoserverResponse: GeoserverGetWorkspacesResponse): Workspace[] => {
  return geoserverResponse.workspaces.workspace.map((ws) => ({
    name: ws.name,
    link: ws.href,
  }));
};

export const dataStoresResponseConverter = (geoserverResponse: GeoserverGetDataStoresResponse): DataStore[] => {
  return geoserverResponse.dataStores.dataStore.map((ds) => ({
    name: ds.name,
    link: ds.href,
  }));
};

export const dataStoreResponseConverter = (dataStore: GeoserverGetDataStoreResponse['dataStore']): GetDataStoreResponse => {
  const connectionParams = dataStore.connectionParameters.entry.reduce((acc, param) => {
    const [key, value] = Object.values(param);
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    name: dataStore.name,
    dateCreated: dataStore.dateCreated,
    host: connectionParams['host'],
    port: connectionParams['port'],
    schema: connectionParams['schema'],
    dbType: connectionParams['dbtype'],
    dbName: connectionParams['database'],
    sslMode: connectionParams['SSL mode'],
  };
};
