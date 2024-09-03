import { GeoserverWorkspaceRequest } from '../../common/geoserverRestModels';

/* This file contains functions that converts inputs from the geoserver-api to the request input the GeoServer itself expects to receive */
export const workspaceRequestConverter = (workspaceName: string): GeoserverWorkspaceRequest => {
  return {
    workspace: { name: workspaceName },
  };
};
