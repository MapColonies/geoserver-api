import { Logger } from '@map-colonies/js-logger';
import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { ConflictError, HttpError, NotFoundError, MethodNotAllowedError } from '@map-colonies/error-types';
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
      const recurse = req.query.recurse ?? false;
      const workspaceName = req.params.name;
      await this.workspacesManager.deleteWorkspace(workspaceName, recurse);
      res.status(StatusCodes.OK).send({ message: 'OK' });
    } catch (error) {
      if (error instanceof NotFoundError) {
        (error as HttpError).status = StatusCodes.NOT_FOUND;
        error.message = 'No workspace found';
      }
      next(error);
    }
  };

  public createWorkspace: CreateWorkspaceHandler = async (req, res, next) => {
    try {
      const workspaceName = req.body.name;
      await this.workspacesManager.createWorkspace(workspaceName);
      res.status(StatusCodes.CREATED).send();
    } catch (error) {
      if (error instanceof ConflictError) {
        (error as HttpError).status = StatusCodes.CONFLICT; //409
      }
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
      if (error instanceof ConflictError) {
        (error as HttpError).status = StatusCodes.CONFLICT; //409
      }
      if (error instanceof NotFoundError) {
        (error as HttpError).status = StatusCodes.NOT_FOUND; //404
      }
      if (error instanceof MethodNotAllowedError) {
        (error as HttpError).status = StatusCodes.METHOD_NOT_ALLOWED; //405
      }
      next(error);
    }
  };
}
