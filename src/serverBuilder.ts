import express from 'express';
import type { Router } from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { OpenapiViewerRouter, OpenapiRouterConfig } from '@map-colonies/openapi-express-viewer';
import { getErrorHandlerMiddleware } from '@map-colonies/error-express-handler';
import { middleware as OpenApiMiddleware } from 'express-openapi-validator';
import { inject, injectable } from 'tsyringe';
import type { Logger } from '@map-colonies/js-logger';
import httpLogger from '@map-colonies/express-access-log-middleware';
import { collectMetricsExpressMiddleware } from '@map-colonies/prometheus';
import type { Registry } from 'prom-client';
import { SERVICES } from './common/constants';
import type { ConfigType } from './common/config';
import { WORKSPACES_ROUTER_SYMBOL } from './workspaces/routes/workspacesRouter';
import { DATASTORES_ROUTER_SYMBOL } from './dataStores/routes/dataStoresRouter';
import { FEATURETYPES_ROUTER_SYMBOL } from './featureTypes/routes/featureTypesRouter';
import { WFS_ROUTER_SYMBOL } from './services/wfs/routes/wfsRouter';

@injectable()
export class ServerBuilder {
  private readonly serverInstance: express.Application;

  public constructor(
    @inject(SERVICES.CONFIG) private readonly config: ConfigType,
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.METRICS) private readonly metricsRegistry: Registry,
    @inject(WORKSPACES_ROUTER_SYMBOL) private readonly workspacesRouter: Router,
    @inject(DATASTORES_ROUTER_SYMBOL) private readonly dataStoresRouter: Router,
    @inject(FEATURETYPES_ROUTER_SYMBOL) private readonly featureTypesRouter: Router,
    @inject(WFS_ROUTER_SYMBOL) private readonly wfsRouter: Router
  ) {
    this.serverInstance = express();
  }

  public build(): express.Application {
    this.registerPreRoutesMiddleware();
    this.buildRoutes();
    this.registerPostRoutesMiddleware();

    return this.serverInstance;
  }

  private buildDocsRoutes(): void {
    const openapiRouter = new OpenapiViewerRouter({
      ...(this.config.get('openapiConfig') as unknown as OpenapiRouterConfig),
      filePathOrSpec: this.config.get('openapiConfig.filePath'),
    });
    openapiRouter.setup();
    this.serverInstance.use(this.config.get('openapiConfig.basePath'), openapiRouter.getRouter());
  }

  private buildRoutes(): void {
    this.serverInstance.use('/workspaces', this.workspacesRouter);
    this.serverInstance.use('/dataStores', this.dataStoresRouter);
    this.serverInstance.use('/featureTypes', this.featureTypesRouter);
    this.serverInstance.use('/services', this.wfsRouter);
    this.buildDocsRoutes();
  }

  private registerPreRoutesMiddleware(): void {
    this.serverInstance.use(collectMetricsExpressMiddleware({ registry: this.metricsRegistry }));
    this.serverInstance.use(httpLogger({ logger: this.logger as unknown as never, ignorePaths: ['/metrics'] }));

    if (this.config.get('server.response.compression.enabled')) {
      this.serverInstance.use(compression(this.config.get('server.response.compression.options') as unknown as compression.CompressionFilter));
    }

    this.serverInstance.use(bodyParser.json(this.config.get('server.request.payload') as unknown as bodyParser.Options));

    const ignoreBasePath = this.config.get('openapiConfig.basePath');
    const ignorePathRegex = new RegExp(`^${ignoreBasePath}/.*`, 'i');
    const apiSpecPath = this.config.get('openapiConfig.filePath');
    this.serverInstance.use(OpenApiMiddleware({ apiSpec: apiSpecPath, validateRequests: true, ignorePaths: ignorePathRegex }));
  }

  private registerPostRoutesMiddleware(): void {
    this.serverInstance.use(getErrorHandlerMiddleware());
  }
}
