import { get, set } from 'lodash';
import type { ConfigType } from '../../src/common/config';

let mockConfig: Record<string, unknown> = {};
const getMock = jest.fn();
const hasMock = jest.fn();

const configMock = {
  get: getMock,
  has: hasMock,
} as unknown as ConfigType;

const init = (): void => {
  getMock.mockImplementation((key: string): unknown => {
    return (get as (object: Record<string, unknown>, path: string) => unknown)(mockConfig, key);
  });

  hasMock.mockImplementation((key: string): boolean => {
    return (get as (object: Record<string, unknown>, path: string) => unknown)(mockConfig, key) !== undefined;
  });
};

const setValue = (key: string, value: unknown): void => {
  set(mockConfig, key, value);
};

const clear = (): void => {
  mockConfig = {};
  getMock.mockReset();
  hasMock.mockReset();
  init();
};

const registerDefaultConfig = (): void => {
  const config = {
    openapiConfig: {
      filePath: './openapi3.yaml',
      basePath: '/docs',
      rawPath: '/api',
      uiPath: '/api',
    },
    telemetry: {
      logger: {
        level: 'info',
        prettyPrint: false,
        opentelemetryOptions: {
          enabled: false,
        },
      },
      shared: {},
      tracing: {
        isEnabled: false,
      },
    },
    server: {
      port: 8080,
      request: {
        payload: {
          limit: '1mb',
        },
      },
      response: {
        compression: {
          enabled: true,
          options: null,
        },
      },
    },
    geoserver: {
      url: 'http://localhost:8080/geoserver',
      auth: {
        username: 'kartoza',
        password: 'myawesomegeoserver',
      },
      dataStore: {
        username: 'postgres',
        password: 'mysecretpassword',
        host: 'localhost',
        port: '5432',
        schema: 'polygon_parts',
        dbName: 'postgres',
        dbType: 'postgis',
        sslMode: 'DISABLE',
      },
      srs: 'EPSG:4326',
      numOfDecimals: 100,
      wfsMaxFeatures: 1000,
    },
    httpRetry: {
      attempts: 5,
      delay: 'exponential',
      shouldResetTimeout: true,
    },
    disableHttpClientLogs: false,
  };

  mockConfig = config;
  init();
};

export { configMock, getMock, hasMock, init, setValue, clear, registerDefaultConfig };
