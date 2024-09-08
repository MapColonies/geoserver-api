import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { WorkspacesController } from '../controllers/workspacesController';

const workspacesRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(WorkspacesController);

  router.get('/', controller.getWorkspaces.bind(controller));
  router.post('/', controller.createWorkspace.bind(controller));
  router.get('/:name', controller.getWorkspace.bind(controller));
  router.delete('/:name', controller.deleteWorkspace.bind(controller));
  router.put('/:name/:newName', controller.updateWorkspace.bind(controller));

  return router;
};

export const WORKSPACES_ROUTER_SYMBOL = Symbol('workspacesRouterFactory');

export { workspacesRouterFactory };
