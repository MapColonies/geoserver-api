import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { FeatureTypesManager } from '../models/featureTypesManager';
import { FeatureTypeRequest, FeatureTypesRequest, GetFeatureTypesQueryParams, GetFeatureTypesResponse } from '../../common/interfaces';
//import { getWorkspacesResponse } from '../../common/interfaces';

type GetFeatureTypesHandler = RequestHandler<FeatureTypesRequest, GetFeatureTypesResponse, unknown, GetFeatureTypesQueryParams>;
type GetFeatureTypeHandler = RequestHandler<FeatureTypeRequest, unknown, unknown>;

// type CreateWorkspaceHandler = RequestHandler<undefined, undefined, WorkspaceRequest>;
// type GetWorkspacesHandler = RequestHandler<undefined, GetWorkspacesResponse, unknown>;

// type DeleteWorkspaceHandler = RequestHandler<WorkspaceRequest, MessageResponse, unknown, DeleteWorkspaceQueryParams>;
// type UpdateWorkspaceHandler = RequestHandler<UpdateWorkspaceRequest, undefined, unknown>;

@injectable()
export class FeatureTypesController {
  public constructor(private readonly featureTypesManager: FeatureTypesManager) {}

  public getFeatureTypes: GetFeatureTypesHandler = async (req, res, next) => {
    try {
      const { workspaceName, dataStoreName } = req.params;
      const list = req.query.list;

      const featureTypes = await this.featureTypesManager.getFeatureTypes(workspaceName, dataStoreName, list);
      res.status(StatusCodes.OK).send(featureTypes);
    } catch (error) {
      next(error);
    }
  };

    public getFeatureType: GetFeatureTypeHandler = async (req, res, next) => {
      try {
        const { workspaceName, dataStoreName , featureTypeName } = req.params;
        const featureType = await this.featureTypesManager.getFeatureType(workspaceName, dataStoreName , featureTypeName);
        res.status(StatusCodes.OK).send(featureType);
      } catch (error) {
        next(error);
      }
    };

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
