import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import { container, instancePerContainerCachingFactory } from 'tsyringe';
import { SERVICES } from '../../../../src/common/constants';
import { InjectionObject } from '../../../../src/common/dependencyRegistration';
import { configMock, getMock, hasMock, registerDefaultConfig } from '../../../mocks/configMock';
import { WORKSPACES_ROUTER_SYMBOL, workspacesRouterFactory } from '../../../../src/workspaces/routes/workspacesRouter';

function getTestContainerConfig(): InjectionObject<unknown>[] {
  registerDefaultConfig();

  return [
    { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
    { token: SERVICES.CONFIG, provider: { useValue: configMock } },
    { token: SERVICES.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
    { token: WORKSPACES_ROUTER_SYMBOL, provider: { useFactory: instancePerContainerCachingFactory(workspacesRouterFactory) } },
  ];
}

const resetContainer = (clearInstances = true): void => {
  if (clearInstances) {
    container.clearInstances();
  }

  getMock.mockReset();
  hasMock.mockReset();
};

export { getTestContainerConfig, resetContainer };
