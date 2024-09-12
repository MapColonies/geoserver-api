import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { FeatureTypesManager } from '../models/featureTypesManager';
import {

} from '../../common/interfaces';
//import { getWorkspacesResponse } from '../../common/interfaces';

type GetFeatureTypesHandler = RequestHandler<WorkspaceRequest, GetWorkspaceResponse, unknown>;

// type CreateWorkspaceHandler = RequestHandler<undefined, undefined, WorkspaceRequest>;
// type GetWorkspacesHandler = RequestHandler<undefined, GetWorkspacesResponse, unknown>;

// type DeleteWorkspaceHandler = RequestHandler<WorkspaceRequest, MessageResponse, unknown, DeleteWorkspaceQueryParams>;
// type UpdateWorkspaceHandler = RequestHandler<UpdateWorkspaceRequest, undefined, unknown>;

@injectable()
export class WorkspacesController {
  public constructor(private readonly featureTypesManager: FeatureTypesManager) {}

  public getFeatureTypes: GetFeatureTypesHandler = async (req, res, next) => {
    try {
        const workspaceName = req.params.workspaceName;
      const dataStoreName = req.params.dataStoreName;
      const workspaces = await this.featureTypesManager.getFeatureTypes(workspaceName, dataStoreName);
      res.status(StatusCodes.OK).send(workspaces);
    } catch (error) {
      next(error);
    }
  };

//   public getFeatureType: GetWorkspaceHandler = async (req, res, next) => {
//     try {
//       const workspace = await this.featureTypesManager.getFeatureType();
//       res.status(StatusCodes.OK).send(workspace);
//     } catch (error) {
//       next(error);
//     }
//   };

//   public deleteFeatureType: DeleteWorkspaceHandler = async (req, res, next) => {
//     try {
//       const isRecursive = req.query.isRecursive ?? false;
//       const workspaceName = req.params.workspaceName;
//       const dataStoreName = req.params.dataStoreName;
//       const featureTypeName = req.params.featureTypeName;
//       await this.featureTypesManager.deleteFeatureType(workspaceName, dataStoreName, featureTypeName,isRecursive);
//       res.status(StatusCodes.OK).send({ message: 'OK' });
//     } catch (error) {
//       next(error);
//     }
//   };

//   public createFeatureType: CreateWorkspaceHandler = async (req, res, next) => {
//     try {
//         const workspaceName = req.params.workspaceName;
//         const dataStoreName = req.params.dataStoreName;
//       await this.featureTypesManager.createFeatureType(workspaceName);
//       res.status(StatusCodes.CREATED).send();
//     } catch (error) {
//       next(error);
//     }
//   };

//   public updateFeatureType: UpdateWorkspaceHandler = async (req, res, next) => {
//     try {
//         const workspaceName = req.params.workspaceName;
//         const dataStoreName = req.params.dataStoreName;
//         const featureTypeName = req.params.featureTypeName;

//       await this.featureTypesManager.updateFeatureTypes(workspaceName, workspaceNewName);
//       res.status(StatusCodes.OK).send();
//     } catch (error) {
//       next(error);
//     }
//   };
}
