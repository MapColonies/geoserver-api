import { getOtelMixin } from '@map-colonies/tracing-utils';
import { trace } from '@opentelemetry/api';
import { DependencyContainer } from 'tsyringe/dist/typings/types';
import { jsLogger } from '@map-colonies/js-logger';
import { Registry } from 'prom-client';
import { SERVICES, SERVICE_NAME } from './common/constants';
import { getTracing } from './common/tracing';
import { workspacesRouterFactory, WORKSPACES_ROUTER_SYMBOL } from './workspaces/routes/workspacesRouter';
import { InjectionObject, registerDependencies } from './common/dependencyRegistration';
import { DATASTORES_ROUTER_SYMBOL, dataStoresRouterFactory } from './dataStores/routes/dataStoresRouter';
import { FEATURETYPES_ROUTER_SYMBOL, featureTypesRouterFactory } from './featureTypes/routes/featureTypesRouter';
import { WFS_ROUTER_SYMBOL, wfsRouterFactory } from './services/wfs/routes/wfsRouter';
import { getConfig } from './common/config';

interface RegisterOptions {
  override?: InjectionObject<unknown>[];
  useChild?: boolean;
}

export const registerExternalValues = async (options?: RegisterOptions): Promise<DependencyContainer> => {
  const configInstance = getConfig();
  const loggerConfig = configInstance.get('telemetry.logger');
  const logger = await jsLogger({ ...loggerConfig, prettyPrint: loggerConfig.prettyPrint, mixin: getOtelMixin() });
  const tracer = trace.getTracer(SERVICE_NAME);
  const metricsRegistry = new Registry();

  const dependencies: InjectionObject<unknown>[] = [
    { token: SERVICES.CONFIG, provider: { useValue: configInstance } },
    { token: SERVICES.LOGGER, provider: { useValue: logger } },
    { token: SERVICES.TRACER, provider: { useValue: tracer } },
    { token: SERVICES.METRICS, provider: { useValue: metricsRegistry } },
    { token: WORKSPACES_ROUTER_SYMBOL, provider: { useFactory: workspacesRouterFactory } },
    { token: DATASTORES_ROUTER_SYMBOL, provider: { useFactory: dataStoresRouterFactory } },
    { token: FEATURETYPES_ROUTER_SYMBOL, provider: { useFactory: featureTypesRouterFactory } },
    { token: WFS_ROUTER_SYMBOL, provider: { useFactory: wfsRouterFactory } },
    {
      token: 'onSignal',
      provider: {
        useValue: {
          useValue: async (): Promise<void> => {
            await Promise.all([getTracing().stop()]);
          },
        },
      },
    },
  ];

  return registerDependencies(dependencies, options?.override, options?.useChild);
};

export type { RegisterOptions };
