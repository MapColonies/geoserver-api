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

export interface GetWorkspaceResponse {
  name: string;
  dateCreated: string;
}

export interface MessageResponse {
  message: string;
}

export interface DeleteWorkspaceQueryParams {
  isRecursive?: boolean;
}

export type GetWorkspacesResponse = Workspace[];

export interface UpdateWorkspaceRequest extends WorkspaceRequest {
  newName: string;
}
