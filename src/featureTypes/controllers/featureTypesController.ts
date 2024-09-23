import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { FeatureTypesManager } from '../models/featureTypesManager';
import {
  DeleteQueryParams,
  FeatureTypeBodyRequest,
  FeatureTypeRequest,
  FeatureTypesRequest,
  GetFeatureTypesQueryParams,
  GetFeatureTypesResponse,
  MessageResponse,
} from '../../common/interfaces';

type GetFeatureTypesHandler = RequestHandler<FeatureTypesRequest, GetFeatureTypesResponse, unknown, GetFeatureTypesQueryParams>;
type GetFeatureTypeHandler = RequestHandler<FeatureTypeRequest, unknown, unknown>;
type DeleteFeatureTypeHandler = RequestHandler<FeatureTypeRequest, MessageResponse, unknown, DeleteQueryParams>;
type CreateFeatureTypeHandler = RequestHandler<FeatureTypesRequest, unknown, FeatureTypeBodyRequest>;

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
      const { workspaceName, dataStoreName, featureTypeName } = req.params;
      const featureType = await this.featureTypesManager.getFeatureType(workspaceName, dataStoreName, featureTypeName);
      res.status(StatusCodes.OK).send(featureType);
    } catch (error) {
      next(error);
    }
  };

  public deleteFeatureType: DeleteFeatureTypeHandler = async (req, res, next) => {
    try {
      const isRecursive = req.query.isRecursive;
      const { workspaceName, dataStoreName, featureTypeName } = req.params;
      await this.featureTypesManager.deleteFeatureType(workspaceName, dataStoreName, featureTypeName, isRecursive);
      res.status(StatusCodes.OK).send({ message: 'OK' });
    } catch (error) {
      next(error);
    }
  };

  public createFeatureType: CreateFeatureTypeHandler = async (req, res, next) => {
    try {
      const { workspaceName, dataStoreName } = req.params;
      await this.featureTypesManager.createFeatureType(workspaceName, dataStoreName, req.body);
      res.status(StatusCodes.CREATED).send();
    } catch (error) {
      next(error);
    }
  };
}
