/* eslint-disable @typescript-eslint/naming-convention */
import { WfsServiceLevel } from '../../common/enums';
import { GeoServerCreateDataStoreRequest, GeoServerUpdateDataStoreRequest } from '../../common/geoserver/models/dataStore';
import { GeoServerCreateFeatureRequest } from '../../common/geoserver/models/featureType';
import { GeoserverWfsSettingsRequest } from '../../common/geoserver/models/wfsMode';
import { GeoserverWorkspaceRequest } from '../../common/geoserver/models/workspace';
import { ConnectionParams, DataStoreBodyRequest, FeatureTypeBodyRequest } from '../../common/interfaces';
import { attributesMapping, boundingBox, srs, numOfDecimals } from '../featureConstants';

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
    { '@key': 'Expose primary keys', $: 'true' },
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

export const postFeatureTypeRequestConverter = (request: FeatureTypeBodyRequest): GeoServerCreateFeatureRequest => {
  return {
    featureType: {
      name: request.name ?? request.nativeName,
      nativeName: request.nativeName,
      srs: srs,
      nativeBoundingBox: boundingBox,
      latLonBoundingBox: boundingBox,
      numDecimals: numOfDecimals,
      attributes: { attribute: attributesMapping },
    },
  };
};

export const updateWfsModeRequestConverter = (mode: WfsServiceLevel, maxFeatures: number): GeoserverWfsSettingsRequest => {
  return {
    wfs: {
      serviceLevel: mode,
      maxFeatures: maxFeatures,
    },
  };
};
