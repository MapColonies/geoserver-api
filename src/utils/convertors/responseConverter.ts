import { ListParam, WfsServiceLevel } from '../../common/enums';
import { GeoserverGetDataStoreResponse, GeoserverGetDataStoresResponse } from '../../common/geoserver/models/dataStore';
import {
  GeoserverFeatureTypeResponse,
  GeoserverGetConfiguredFeatureTypesResponse,
  GeoserverGetFeatureTypesResponse,
} from '../../common/geoserver/models/featureType';
import { GeoServerGetWfsSettingsResponse } from '../../common/geoserver/models/wfsMode';
import { GeoserverGetWorkspacesResponse } from '../../common/geoserver/models/workspace';
import { DataStore, GetDataStoreResponse, GetFeatureTypeResponse, GetFeatureTypesResponse, WfsSettings, Workspace } from '../../common/interfaces';

/* This file contains functions that converts outputs from the Geo server to the response output the api expects to receive */
export const workspaceResponseConverter = (geoserverResponse: GeoserverGetWorkspacesResponse): Workspace[] => {
  return geoserverResponse.workspaces.workspace
    ? geoserverResponse.workspaces.workspace.map((ws) => ({
        name: ws.name,
        link: ws.href,
      }))
    : [];
};

export const dataStoresResponseConverter = (geoserverResponse: GeoserverGetDataStoresResponse): DataStore[] => {
  return geoserverResponse.dataStores.dataStore
    ? geoserverResponse.dataStores.dataStore.map((ds) => ({
        name: ds.name,
        link: ds.href,
      }))
    : [];
};

export const featureTypesResponseConverter = (
  geoserverResponse: GeoserverGetFeatureTypesResponse | GeoserverGetConfiguredFeatureTypesResponse,
  list: ListParam
): GetFeatureTypesResponse => {
  if (list === ListParam.CONFIGURED) {
    const configuredResponse = geoserverResponse as GeoserverGetConfiguredFeatureTypesResponse;
    if (!configuredResponse.featureTypes.featureType) {
      return [];
    }
    return configuredResponse.featureTypes.featureType.map((feature) => ({
      name: feature.name,
      link: feature.href,
    }));
  } else {
    const simpleResponse = geoserverResponse as GeoserverGetFeatureTypesResponse;
    if (!simpleResponse.list.string) {
      return [];
    }
    return simpleResponse.list.string.map((featureName) => ({
      name: featureName,
    }));
  }
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

export const featureTypeResponseConverter = (geoserverResponse: GeoserverFeatureTypeResponse): GetFeatureTypeResponse => {
  const { name, srs, maxFeatures, attributes, nativeName, enabled } = geoserverResponse.featureType;

  return {
    name,
    enabled,
    srs,
    maxFeatures,
    attributes,
    tableName: nativeName, // Mapping nativeName to tableName
  };
};

export const getWfsModeResponseConverter = (geoserverResponse: GeoServerGetWfsSettingsResponse): WfsSettings => {
  const { serviceLevel, maxFeatures } = geoserverResponse.wfs;

  // Validate the serviceLevel is a valid WfsServiceLevel
  if (!Object.values(WfsServiceLevel).includes(serviceLevel as WfsServiceLevel)) {
    throw new Error(`Invalid service level: ${serviceLevel}`);
  }

  return {
    serviceLevel: serviceLevel as WfsServiceLevel,
    maxFeatures,
  };
};
