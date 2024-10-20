import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { WfsController } from '../controllers/wfsController';

const wfsRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(WfsController);

  router.get('/wfs/settings', controller.getWfsMode.bind(controller));
  router.put('/wfs/settings', controller.updateWfsMode.bind(controller));

  return router;
};

export const WFS_ROUTER_SYMBOL = Symbol('wfsRouterFactory');

export { wfsRouterFactory };
