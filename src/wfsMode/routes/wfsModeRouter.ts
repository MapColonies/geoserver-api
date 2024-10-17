import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { WfsModeController } from '../controllers/wfsModeController';

const wfsModeRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(WfsModeController);

  router.get('/', controller.getWfsMode.bind(controller));
  router.put('/', controller.updateWfsMode.bind(controller));

  return router;
};

export const WFSMODE_ROUTER_SYMBOL = Symbol('wfsModeRouterFactory');

export { wfsModeRouterFactory };
