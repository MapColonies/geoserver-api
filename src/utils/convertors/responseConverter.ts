import { GeoserverGetWorkspacesResponse } from '../../common/geoserver/models/workspace';
import { Workspace } from '../../common/interfaces';

/* This file contains functions that converts outputs from the Geo server to the response output the api expects to receive */
export const workspaceResponseConverter = (geoserverResponse: GeoserverGetWorkspacesResponse): Workspace[] => {
  return geoserverResponse.workspaces.workspace.map((ws) => ({
    name: ws.name,
    link: ws.href,
  }));
};
