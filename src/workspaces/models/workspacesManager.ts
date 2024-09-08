import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { ConflictError, NotFoundError } from '@map-colonies/error-types';
import { withSpanAsyncV4 } from '@map-colonies/telemetry';
import { SERVICES } from '../../common/constants';
import { LogContext } from '../../utils/logger/logContext';
import { GetWorkspaceResponse, IConfig, Workspace } from '../../common/interfaces';
import { GeoserverClient } from '../../serviceClients/geoserverClient';
import { workspaceResponseConverter } from '../../utils/convertors/responseConverter';
import { GeoserverGetWorkspaceResponse, GeoserverGetWorkspacesResponse } from '../../common/geoserver/models/workspace';
import { workspaceRequestConverter } from '../../utils/convertors/requestConverter';

@injectable()
export class WorkspacesManager {
  private readonly logContext: LogContext;
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer,
    private readonly geoserverManager: GeoserverClient
  ) {
    this.logContext = {
      fileName: __filename,
      class: WorkspacesManager.name,
    };
  }

  @withSpanAsyncV4
  public async getWorkspaces(): Promise<Workspace[]> {
    const logCtx: LogContext = { ...this.logContext, function: this.getWorkspaces.name };
    this.logger.info({ msg: 'getting workspaces', logContext: logCtx });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoserverGetWorkspacesResponse>('workspaces');
    const response = workspaceResponseConverter(geoserverResponse);
    return response;
  }

  @withSpanAsyncV4
  public async getWorkspace(name: string): Promise<GetWorkspaceResponse> {
    const logCtx: LogContext = { ...this.logContext, function: this.getWorkspace.name };
    this.logger.info({ msg: 'getting workspace', metadata: { name }, logContext: logCtx });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoserverGetWorkspaceResponse>(`workspaces/${name}`);
    const response = { name: geoserverResponse.workspace.name, dateCreated: geoserverResponse.workspace.dateCreated };
    return response;
  }

  @withSpanAsyncV4
  public async deleteWorkspace(name: string, isRecursive: boolean): Promise<void> {
    const logCtx: LogContext = { ...this.logContext, function: this.deleteWorkspace.name };
    this.logger.info({ msg: 'deleteing workspace', metadata: { name }, logContext: logCtx });
    await this.geoserverManager.deleteRequest<{ recurse: boolean }>(`workspaces/${name}`, { queryParams: { recurse: isRecursive } });
  }

  @withSpanAsyncV4
  public async createWorkspace(name: string): Promise<void> {
    const logCtx: LogContext = { ...this.logContext, function: this.createWorkspace.name };
    this.logger.info({ msg: 'creating workspace', metadata: { name }, logContext: logCtx });
    const workspaceRequest = workspaceRequestConverter(name);
    await this.geoserverManager.postRequest('workspaces', workspaceRequest);
  }

  @withSpanAsyncV4
  public async updateWorkspace(oldName: string, newName: string): Promise<void> {
    const logCtx: LogContext = { ...this.logContext, function: this.updateWorkspace.name };
    this.logger.info({ msg: 'updating workspace', metadata: { oldName, newName }, logContext: logCtx });
    const doesNewNameExists = await this.workspaceExists(newName);
    if (!doesNewNameExists) {
      this.logger.debug({ msg: 'new workspace name is valid ', logContext: logCtx });
      const workspaceRequest = workspaceRequestConverter(newName);
      await this.geoserverManager.putRequest(`workspaces/${oldName}`, workspaceRequest);
    } else {
      const errorMessage = `Cant change workspace ${oldName} to ${newName} , there is already a workspace named ${newName}`;
      this.logger.error({ msg: errorMessage });
      throw new ConflictError(errorMessage);
    }
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
