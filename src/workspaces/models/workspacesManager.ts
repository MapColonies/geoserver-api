import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { ConflictError, NotFoundError } from '@map-colonies/error-types';
import { withSpanAsyncV4 } from '@map-colonies/telemetry';
import { SERVICES } from '../../common/constants';
import { GetWorkspaceResponse, IConfig, IRecurse, Workspace } from '../../common/interfaces';
import { GeoserverClient } from '../../serviceClients/geoserverClient';
import { workspaceResponseConverter } from '../../utils/convertors/responseConverter';
import { GeoserverGetWorkspaceResponse, GeoserverGetWorkspacesResponse } from '../../common/geoserver/models/workspace';
import { workspaceRequestConverter } from '../../utils/convertors/requestConverter';

@injectable()
export class WorkspacesManager {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer,
    private readonly geoserverManager: GeoserverClient
  ) {}

  @withSpanAsyncV4
  public async getWorkspaces(): Promise<Workspace[]> {
    this.logger.info({ msg: 'getting workspaces' });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoserverGetWorkspacesResponse>('workspaces');
    const response = workspaceResponseConverter(geoserverResponse);
    return response;
  }

  @withSpanAsyncV4
  public async getWorkspace(name: string): Promise<GetWorkspaceResponse> {
    this.logger.info({ msg: `getting workspace: ${name}`, workspace: name });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoserverGetWorkspaceResponse>(`workspaces/${name}`);
    const response = { name: geoserverResponse.workspace.name, dateCreated: geoserverResponse.workspace.dateCreated };
    return response;
  }

  @withSpanAsyncV4
  public async deleteWorkspace(name: string, isRecursive: boolean): Promise<void> {
    this.logger.info({ msg: `deleting workspace: ${name}`, workspace: name, isRecursive });
    await this.geoserverManager.deleteRequest<IRecurse>(`workspaces/${name}`, { queryParams: { recurse: isRecursive } });
  }

  @withSpanAsyncV4
  public async createWorkspace(name: string): Promise<void> {
    this.logger.info({ msg: `creating workspace: ${name}`, workspace: name });
    const workspaceRequest = workspaceRequestConverter(name);
    await this.geoserverManager.postRequest('workspaces', workspaceRequest);
  }

  @withSpanAsyncV4
  public async updateWorkspace(oldName: string, newName: string): Promise<void> {
    this.logger.info({ msg: `updating workspace: ${oldName} to new name: ${newName}`, oldName, newName });
    const doesNewNameExists = await this.workspaceExists(newName);
    if (doesNewNameExists) {
      const errorMessage = `Cant change workspace ${oldName} to ${newName} , there is already a workspace named ${newName}`;
      this.logger.error({ msg: errorMessage });
      throw new ConflictError(errorMessage);
    }
    this.logger.debug({ msg: `new workspace name : ${newName} is available` });
    const workspaceRequest = workspaceRequestConverter(newName);
    await this.geoserverManager.putRequest(`workspaces/${oldName}`, workspaceRequest);
  }

  @withSpanAsyncV4
  private async workspaceExists(newName: string): Promise<boolean> {
    try {
      await this.getWorkspace(newName);
      return true;
    } catch (e) {
      if (e instanceof NotFoundError) {
        return false;
      }
      throw e;
    }
  }
}
