import { trace } from '@opentelemetry/api';
import nock from 'nock';
import { jsLogger } from '@map-colonies/js-logger';
import { GeoserverClient } from '../../../../../src/serviceClients/geoserverClient';
import { configMock, registerDefaultConfig, clear as clearConfig } from '../../../../mocks/configMock';
import { WfsManager } from '../../../../../src/services/wfs/models/wfsManager';
import {
  GeoServerGetWfsModeResponse,
  GeoServerGetWfsModeResponseModified,
  getWfsModeResponse,
  putWfsModeRequest,
  updateWfsModeBody,
} from '../../../../mocks/wfsModeMocks';

describe('wfsManager', () => {
  let wfsManager: WfsManager;
  let geoserverManager: GeoserverClient;
  const testTracer = trace.getTracer('testTracer');
  registerDefaultConfig();
  const geoserverUrl = `${configMock.get('geoserver.url') as unknown as string}/rest`;

  beforeEach(async function () {
    registerDefaultConfig();
    const logger = await jsLogger({ enabled: false });
    geoserverManager = new GeoserverClient(configMock, logger, testTracer);
    wfsManager = new WfsManager(logger, configMock, testTracer, geoserverManager);
  });

  afterEach(() => {
    // eslint-disable-next-line import-x/no-named-as-default-member -- prefer nock.cleanAll() for consistency
    nock.cleanAll();
    clearConfig();
    jest.resetAllMocks();
  });

  describe('get wfsSettings', () => {
    it('should return a the wfsSettings of the geoserver', async function () {
      nock(geoserverUrl).get('/services/wfs/settings').reply(200, GeoServerGetWfsModeResponse);
      const wfsSettings = await wfsManager.getWfsSettings();

      expect(wfsSettings).toEqual(getWfsModeResponse);
    });

    it('should throw Error when the wfs serviceLevel is not in the enum list', async function () {
      nock(geoserverUrl).get('/services/wfs/settings').reply(200, GeoServerGetWfsModeResponseModified);
      const action = async () => {
        await wfsManager.getWfsSettings();
      };
      await expect(action()).rejects.toThrow(Error);
    });
  });

  describe('update wfsSettings', () => {
    it('should modify wfsSettings', async function () {
      nock(geoserverUrl).put('/services/wfs/settings', putWfsModeRequest).reply(200);
      const action = async () => {
        await wfsManager.updateWfsMode(updateWfsModeBody.serviceLevel);
      };
      await expect(action()).resolves.not.toThrow();
    });
  });
});
