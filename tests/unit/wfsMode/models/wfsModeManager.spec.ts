import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import nock from 'nock';
import { GeoserverClient } from '../../../../src/serviceClients/geoserverClient';
import { configMock, registerDefaultConfig, clear as clearConfig } from '../../../mocks/configMock';
import { WfsModeManager } from '../../../../src/wfsMode/models/wfsModeManager';
import {
  GeoServerGetWfsModeResponse,
  GeoServerGetWfsModeResponseModified,
  getWfsModeResponse,
  putWfsModeRequest,
  updateWfsModeBody,
} from '../../../mocks/wfsModeMocks';

describe('wfsModeManager', () => {
  let wfsModeManager: WfsModeManager;
  let geoserverManager: GeoserverClient;
  const testTracer = trace.getTracer('testTracer');
  registerDefaultConfig();
  const geoserverUrl = configMock.get<string>('geoserver.url');

  beforeEach(function () {
    registerDefaultConfig();
    geoserverManager = new GeoserverClient(configMock, jsLogger({ enabled: false }), testTracer);
    wfsModeManager = new WfsModeManager(jsLogger({ enabled: false }), configMock, testTracer, geoserverManager);
  });

  afterEach(() => {
    nock.cleanAll();
    clearConfig();
    jest.resetAllMocks();
  });

  describe('get wfsMode', () => {
    it('should return a the wfsMode of the geoserver', async function () {
      nock(geoserverUrl).get('/services/wfs/settings').reply(200, GeoServerGetWfsModeResponse);
      const wfsMode = await wfsModeManager.getWfsMode();

      expect(wfsMode).toEqual(getWfsModeResponse);
    });

    it('should throw Error when the wfs serviceLevel is not in the enum list', async function () {
      nock(geoserverUrl).get('/services/wfs/settings').reply(200, GeoServerGetWfsModeResponseModified);
      const action = async () => {
        await wfsModeManager.getWfsMode();
      };
      await expect(action()).rejects.toThrow(Error);
    });
  });

  describe('update wfsMode', () => {
    it('should modify wfsMode', async function () {
      nock(geoserverUrl).put('/services/wfs/settings', putWfsModeRequest).reply(200);
      const action = async () => {
        await wfsModeManager.updateWfsMode(updateWfsModeBody.serviceLevel);
      };
      await expect(action()).resolves.not.toThrow();
    });
  });
});
