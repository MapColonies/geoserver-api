export interface GeoserverWorkspace {
  name: string;
  href: string;
}

export interface GeoserverGetWorkspacesResponse {
  workspaces: {
    workspace: GeoserverWorkspace[];
  };
}

export interface GeoserverGetWorkspaceResponse {
  workspace: {
    name: string;
    isolated: boolean;
    dateCreated: string;
    dateModified?: string;
    dataStores: string;
    coverageStores: string;
    wmsStores: string;
    wmtsStores: string;
  };
}

export interface GeoserverWorkspaceRequest {
  workspace: {
    name: string;
  };
}
