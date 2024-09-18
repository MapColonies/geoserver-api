import { container } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { ConnectionParams } from '../common/interfaces';
import { DbType, SslMode } from '../common/enums';
import { SERVICES } from '../common/constants';

export const validateConfig = (connectionParams: ConnectionParams): void => {
  const logger = container.resolve<Logger>(SERVICES.LOGGER);
  if (!Object.values(DbType).includes(connectionParams.dbType as DbType)) {
    const errorMessage = `Provided dbType: ${connectionParams.dbType} is not supported`;
    logger.error({ msg: errorMessage });
    throw new Error(errorMessage);
  }
  if (!Object.values(SslMode).includes(connectionParams.sslMode as SslMode)) {
    const errorMessage = `Provided sslMode: ${connectionParams.sslMode} is not supported`;
    logger.error({ msg: errorMessage });
    throw new Error(errorMessage);
  }
};
