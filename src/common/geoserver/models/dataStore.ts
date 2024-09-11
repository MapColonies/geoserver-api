import { GeoserverWorkspace } from './workspace';

interface GeoserverDataStores {
  name: string;
  href: string;
}

export interface GeoserverGetDataStoresResponse {
  dataStores: {
    dataStore: GeoserverDataStores[];
  };
}

/* eslint-disable @typescript-eslint/naming-convention */
export interface GeoserverGetDataStoreResponse {
  dataStore: {
    name: string;
    description: string;
    type: string;
    enabled: boolean;
    workspace: GeoserverWorkspace;
    _default: boolean;
    dateCreated: string;
    dateModified: string;
    disableOnConnFailure: boolean;
    featureTypes: string[];
    connectionParameters: { entry: Record<string, string>[] };
  };
}

export interface GeoServerCreateDataStoreRequest {
  dataStore: {
    name: string;
    disableOnConnFailure?: boolean;
    enabled?: boolean;
    connectionParameters: { entry: Record<string, unknown>[] };
  };
}

export interface GeoServerUpdateDataStoreRequest {
  dataStore: {
    name: string;
  };
}
