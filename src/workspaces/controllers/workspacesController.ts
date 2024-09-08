import { Logger } from '@map-colonies/js-logger';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';

import { WorkspacesManager } from '../models/workspacesManager';
import {
  DeleteWorkspaceQueryParams,
  GetWorkspaceResponse,
  GetWorkspacesResponse,
  MessageResponse,
  UpdateWorkspaceRequest,
  WorkspaceRequest,
} from '../../common/interfaces';
//import { getWorkspacesResponse } from '../../common/interfaces';

type CreateWorkspaceHandler = RequestHandler<undefined, undefined, WorkspaceRequest>;
type GetWorkspacesHandler = RequestHandler<undefined, GetWorkspacesResponse, unknown>;
type GetWorkspaceHandler = RequestHandler<WorkspaceRequest, GetWorkspaceResponse, unknown>;
type DeleteWorkspaceHandler = RequestHandler<WorkspaceRequest, MessageResponse, unknown, DeleteWorkspaceQueryParams>;
type UpdateWorkspaceHandler = RequestHandler<UpdateWorkspaceRequest, undefined, unknown>;

@injectable()
export class WorkspacesController {
  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger, private readonly workspacesManager: WorkspacesManager) {}

  public getWorkspaces: GetWorkspacesHandler = async (req, res, next) => {
    try {
      const workspaces = await this.workspacesManager.getWorkspaces();
      res.status(StatusCodes.OK).send(workspaces);
    } catch (error) {
      next(error);
    }
  };

  public getWorkspace: GetWorkspaceHandler = async (req, res, next) => {
    try {
      const workspace = await this.workspacesManager.getWorkspace(req.params.name);
      res.status(StatusCodes.OK).send(workspace);
    } catch (error) {
      next(error);
    }
  };

  public deleteWorkspace: DeleteWorkspaceHandler = async (req, res, next) => {
    try {
      const isRecursive = req.query.isRecursive ?? false;
      const workspaceName = req.params.name;
      await this.workspacesManager.deleteWorkspace(workspaceName, isRecursive);
      res.status(StatusCodes.OK).send({ message: 'OK' });
    } catch (error) {
      next(error);
    }
  };

  public createWorkspace: CreateWorkspaceHandler = async (req, res, next) => {
    try {
      const workspaceName = req.body.name;
      await this.workspacesManager.createWorkspace(workspaceName);
      res.status(StatusCodes.CREATED).send();
    } catch (error) {
      next(error);
    }
  };

  public updateWorkspace: UpdateWorkspaceHandler = async (req, res, next) => {
    try {
      const workspaceName = req.params.name;
      const workspaceNewName = req.params.newName;

      await this.workspacesManager.updateWorkspace(workspaceName, workspaceNewName);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      next(error);
    }
  };
}
