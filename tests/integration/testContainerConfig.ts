import { jsLogger } from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import { Registry } from 'prom-client';
import { container, instancePerContainerCachingFactory } from 'tsyringe';
import { SERVICES } from '../../src/common/constants';
import type { InjectionObject } from '../../src/common/dependencyRegistration';
import { configMock, getMock, hasMock, registerDefaultConfig } from '../mocks/configMock';
import { WORKSPACES_ROUTER_SYMBOL, workspacesRouterFactory } from '../../src/workspaces/routes/workspacesRouter';
import { DATASTORES_ROUTER_SYMBOL, dataStoresRouterFactory } from '../../src/dataStores/routes/dataStoresRouter';
import { FEATURETYPES_ROUTER_SYMBOL, featureTypesRouterFactory } from '../../src/featureTypes/routes/featureTypesRouter';
import { WFS_ROUTER_SYMBOL, wfsRouterFactory } from '../../src/services/wfs/routes/wfsRouter';

async function getTestContainerConfig(extra?: InjectionObject<unknown>[]): Promise<InjectionObject<unknown>[]> {
  registerDefaultConfig();

  return [
    { token: SERVICES.LOGGER, provider: { useValue: await jsLogger({ enabled: false }) } },
    { token: SERVICES.CONFIG, provider: { useValue: configMock } },
    { token: SERVICES.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
    { token: SERVICES.METRICS, provider: { useValue: new Registry() } },
    { token: WORKSPACES_ROUTER_SYMBOL, provider: { useFactory: instancePerContainerCachingFactory(workspacesRouterFactory) } },
    { token: DATASTORES_ROUTER_SYMBOL, provider: { useFactory: instancePerContainerCachingFactory(dataStoresRouterFactory) } },
    { token: FEATURETYPES_ROUTER_SYMBOL, provider: { useFactory: instancePerContainerCachingFactory(featureTypesRouterFactory) } },
    { token: WFS_ROUTER_SYMBOL, provider: { useFactory: instancePerContainerCachingFactory(wfsRouterFactory) } },
    ...(extra ?? []),
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
