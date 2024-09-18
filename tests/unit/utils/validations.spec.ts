import { container } from 'tsyringe';
import jsLogger from '@map-colonies/js-logger';
import { configMock, registerDefaultConfig, clear as clearConfig } from '../../mocks/configMock';
import { ConnectionParams } from '../../../src/common/interfaces';
import { validateConfig } from '../../../src/utils/validations';
import { SERVICES } from '../../../src/common/constants';

describe('Validation', () => {
  beforeEach(function () {
    registerDefaultConfig();
    container.registerInstance(SERVICES.LOGGER, jsLogger({ enabled: false }));
  });

  afterEach(() => {
    clearConfig();
    jest.resetAllMocks();
  });

  describe('validation connection params', () => {
    it('should not throw errors', function () {
      const connectionParams = configMock.get<ConnectionParams>('geoserver.dataStore');

      const action = () => {
        validateConfig(connectionParams);
      };
      expect(action).not.toThrow();
    });

    it('should throw bad request error when dbType is not supported', function () {
      const connectionParams = {
        ...configMock.get<ConnectionParams>('geoserver.dataStore'),
        dbType: 'post',
      };

      const action = () => {
        validateConfig(connectionParams);
      };
      expect(action).toThrow(Error);
    });

    it('should throw bad request error when sslMode is not supported', function () {
      const connectionParams = {
        ...configMock.get<ConnectionParams>('geoserver.dataStore'),
        sslMode: 'post',
      };

      const action = () => {
        validateConfig(connectionParams);
      };
      expect(action).toThrow(Error);
    });
  });
});
