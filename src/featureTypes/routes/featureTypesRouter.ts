import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { FeatureTypesController } from '../controllers/featureTypesController';

const featureTypesRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(FeatureTypesController);

  router.get('/:workspaceName/:dataStoreName', controller.getFeatureTypes.bind(controller));
  router.post('/:workspaceName/:dataStoreName', controller.createFeatureType.bind(controller));
  router.get('/:workspaceName/:dataStoreName/:featureTypeName', controller.getFeatureType.bind(controller));
  router.delete('/:workspaceName/:dataStoreName/:featureTypeName', controller.deleteFeatureType.bind(controller));

  return router;
};

export const FEATURETYPES_ROUTER_SYMBOL = Symbol('featureTypesRouterFactory');

export { featureTypesRouterFactory };
