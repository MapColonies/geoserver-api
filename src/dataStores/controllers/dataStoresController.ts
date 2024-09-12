import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { DataStoresManager } from '../models/dataStoresManager';
import {
  DataStoreNameRequest,
  DataStoreRequest,
  DataStoresRequest,
  DeleteQueryParams,
  GetDataStoreResponse,
  GetDataStoresResponse,
  MessageResponse,
} from '../../common/interfaces';

type GetDataStoresHandler = RequestHandler<DataStoresRequest, GetDataStoresResponse, unknown>;
type GetDataStoreHandler = RequestHandler<DataStoreRequest, GetDataStoreResponse, unknown>;
type CreateDataStoreHandler = RequestHandler<DataStoresRequest, MessageResponse, DataStoreNameRequest>;
type DeleteDataStoreHandler = RequestHandler<DataStoreRequest, MessageResponse, unknown, DeleteQueryParams>;
type UpdateDataStoreHandler = RequestHandler<DataStoreRequest, MessageResponse, DataStoreNameRequest>;

@injectable()
export class DataStoresController {
  public constructor(private readonly dataStoresManager: DataStoresManager) {}

  public getDataStores: GetDataStoresHandler = async (req, res, next) => {
    try {
      const workspaceName = req.params.workspaceName;
      const dataStores = await this.dataStoresManager.getDataStores(workspaceName);
      res.status(StatusCodes.OK).send(dataStores);
    } catch (error) {
      next(error);
    }
  };

  public getDataStore: GetDataStoreHandler = async (req, res, next) => {
    try {
      const workspaceName = req.params.workspaceName;
      const dataStoreName = req.params.dataStoreName;
      const dataStoreInfo = await this.dataStoresManager.getDataStore(workspaceName, dataStoreName);
      res.status(StatusCodes.OK).send(dataStoreInfo);
    } catch (error) {
      next(error);
    }
  };

  public deleteDataStore: DeleteDataStoreHandler = async (req, res, next) => {
    try {
      const isRecursive = req.query.isRecursive ?? false;
      const workspaceName = req.params.workspaceName;
      const dataStoreName = req.params.dataStoreName;
      await this.dataStoresManager.deleteDataStore(workspaceName, dataStoreName, isRecursive);
      res.status(StatusCodes.OK).send({ message: 'OK' });
    } catch (error) {
      next(error);
    }
  };

  public createDataStore: CreateDataStoreHandler = async (req, res, next) => {
    try {
      const workspaceName = req.params.workspaceName;
      const createDataStoreBody = req.body;
      await this.dataStoresManager.createDataStore(workspaceName, createDataStoreBody);
      res.status(StatusCodes.CREATED).send({ message: 'OK' });
    } catch (error) {
      next(error);
    }
  };

  public updateDataStore: UpdateDataStoreHandler = async (req, res, next) => {
    try {
      const workspaceName = req.params.workspaceName;
      const dataStoreName = req.params.dataStoreName;
      await this.dataStoresManager.updateDataStore(workspaceName, dataStoreName, req.body);
      res.status(StatusCodes.OK).send({ message: 'OK' });
    } catch (error) {
      next(error);
    }
  };
}
