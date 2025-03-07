import config from 'config';
import { getOtelMixin } from '@map-colonies/telemetry';
import { trace, metrics as OtelMetrics } from '@opentelemetry/api';
import { DependencyContainer } from 'tsyringe/dist/typings/types';
import jsLogger, { LoggerOptions } from '@map-colonies/js-logger';
import { Metrics } from '@map-colonies/telemetry';
import { SERVICES, SERVICE_NAME } from './common/constants';
import { tracing } from './common/tracing';
import { workspacesRouterFactory, WORKSPACES_ROUTER_SYMBOL } from './workspaces/routes/workspacesRouter';
import { InjectionObject, registerDependencies } from './common/dependencyRegistration';
import { DATASTORES_ROUTER_SYMBOL, dataStoresRouterFactory } from './dataStores/routes/dataStoresRouter';
import { FEATURETYPES_ROUTER_SYMBOL, featureTypesRouterFactory } from './featureTypes/routes/featureTypesRouter';
import { WFS_ROUTER_SYMBOL, wfsRouterFactory } from './services/wfs/routes/wfsRouter';

export interface RegisterOptions {
  override?: InjectionObject<unknown>[];
  useChild?: boolean;
}

export const registerExternalValues = (options?: RegisterOptions): DependencyContainer => {
  const loggerConfig = config.get<LoggerOptions>('telemetry.logger');
  const logger = jsLogger({ ...loggerConfig, prettyPrint: loggerConfig.prettyPrint, mixin: getOtelMixin() });

  const metrics = new Metrics();
  metrics.start();

  const tracer = trace.getTracer(SERVICE_NAME);

  const dependencies: InjectionObject<unknown>[] = [
    { token: SERVICES.CONFIG, provider: { useValue: config } },
    { token: SERVICES.LOGGER, provider: { useValue: logger } },
    { token: SERVICES.TRACER, provider: { useValue: tracer } },
    { token: SERVICES.METER, provider: { useValue: OtelMetrics.getMeterProvider().getMeter(SERVICE_NAME) } },
    { token: WORKSPACES_ROUTER_SYMBOL, provider: { useFactory: workspacesRouterFactory } },
    { token: DATASTORES_ROUTER_SYMBOL, provider: { useFactory: dataStoresRouterFactory } },
    { token: FEATURETYPES_ROUTER_SYMBOL, provider: { useFactory: featureTypesRouterFactory } },
    { token: WFS_ROUTER_SYMBOL, provider: { useFactory: wfsRouterFactory } },
    {
      token: 'onSignal',
      provider: {
        useValue: {
          useValue: async (): Promise<void> => {
            await Promise.all([tracing.stop(), metrics.stop()]);
          },
        },
      },
    },
  ];

  return registerDependencies(dependencies, options?.override, options?.useChild);
};
