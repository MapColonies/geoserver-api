/* eslint-disable @typescript-eslint/naming-convention */
import { GeoServerCreateDataStoreRequest, GeoServerUpdateDataStoreRequest } from '../../common/geoserver/models/dataStore';
import { GeoserverWorkspaceRequest } from '../../common/geoserver/models/workspace';
import { ConnectionParams, DataStoreBodyRequest } from '../../common/interfaces';

/* This file contains functions that converts inputs from the geoserver-api to the request input the GeoServer itself expects to receive */
export const workspaceRequestConverter = (workspaceName: string): GeoserverWorkspaceRequest => {
  return {
    workspace: { name: workspaceName },
  };
};

export const postDataStoreRequestConverter = (request: DataStoreBodyRequest, connectionParams: ConnectionParams): GeoServerCreateDataStoreRequest => {
  const connectionParameters = [
    { '@key': 'host', $: connectionParams.host },
    { '@key': 'port', $: connectionParams.port.toString() },
    { '@key': 'database', $: connectionParams.dbName },
    { '@key': 'user', $: connectionParams.username },
    { '@key': 'dbtype', $: connectionParams.dbType },
    { '@key': 'schema', $: connectionParams.schema },
    { '@key': 'SSL mode', $: connectionParams.sslMode },
    { '@key': 'validate connections', $: 'true' },
  ];

  if (connectionParams.password != null && connectionParams.password.trim() !== '') {
    connectionParameters.push({ '@key': 'passwd', $: connectionParams.password });
  }

  return {
    dataStore: {
      name: request.name,
      enabled: false,
      disableOnConnFailure: true,
      connectionParameters: {
        entry: connectionParameters,
      },
    },
  };
};

export const updateDataStoreRequestConverter = (updateRequest: DataStoreBodyRequest): GeoServerUpdateDataStoreRequest => {
  return {
    dataStore: {
      name: updateRequest.name,
    },
  };
};
