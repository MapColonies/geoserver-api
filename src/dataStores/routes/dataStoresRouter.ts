import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { DataStoresController } from '../controllers/dataStoresController';

const dataStoresRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(DataStoresController);

  router.get('/:workspaceName', controller.getDataStores.bind(controller));
  router.post('/:workspaceName', controller.createDataStore.bind(controller));
  router.get('/:workspaceName/:dataStoreName', controller.getDataStore.bind(controller));
  router.delete('/:workspaceName/:dataStoreName', controller.deleteDataStore.bind(controller));
  router.put('/:workspaceName/:dataStoreName', controller.updateDataStore.bind(controller));

  return router;
};

export const DATASTORES_ROUTER_SYMBOL = Symbol('dataStoresRouterFactory');

export { dataStoresRouterFactory };
