// this import must be called before the first import of tsyringe
import 'reflect-metadata';
import { createServer } from 'http';
import { createTerminus } from '@godaddy/terminus';
import type { Logger } from '@map-colonies/js-logger';
import type { ConfigType } from './common/config';
import { DEFAULT_SERVER_PORT, SERVICES } from './common/constants';

import { getApp } from './app';
import { ConnectionParams } from './common/interfaces';
import { validateConfig } from './utils/validations';

void getApp()
  .then(([app, container]) => {
    const logger = container.resolve<Logger>(SERVICES.LOGGER);
    const config = container.resolve<ConfigType>(SERVICES.CONFIG);

    const port = config.get('server.port') || DEFAULT_SERVER_PORT;
    const stubHealthCheck = async (): Promise<void> => Promise.resolve();

    const server = createTerminus(createServer(app), { healthChecks: { '/liveness': stubHealthCheck }, onSignal: container.resolve('onSignal') });

    const connectionParams = config.get('geoserver.dataStore') as unknown as ConnectionParams;
    validateConfig(connectionParams);

    server.listen(port, () => {
      logger.info(`app started on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('😢 - failed initializing the server');
    console.error(error);
    process.exit(1);
  });
