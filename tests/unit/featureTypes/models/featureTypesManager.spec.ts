import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import nock from 'nock';
import { ConflictError, ForbiddenError, NotFoundError, UnprocessableEntityError } from '@map-colonies/error-types';
import { GeoserverClient } from '../../../../src/serviceClients/geoserverClient';
import { configMock, registerDefaultConfig, clear as clearConfig } from '../../../mocks/configMock';
import { FeatureTypesManager } from '../../../../src/featureTypes/models/featureTypesManager';
import {
  featureTypesListAllResponseMock,
  featureTypesListConfiguredResponseMock,
  geoserverFeatureTypesListAllResponseMock,
  geoserverFeatureTypesListConfiguredResponseMock,
  geoserverGetFeatureTypeResponseMock,
  geoserverPostFeatureTypeRequestMock,
  getFeatureTypeResponseMock,
  postFeatureTypeRequestMock,
} from '../../../mocks/featureTypesMocks';
import { ListParam } from '../../../../src/common/enums';

describe('DataStoresManager', () => {
  let featureTypesManager: FeatureTypesManager;
  let geoserverManager: GeoserverClient;
  const testTracer = trace.getTracer('testTracer');
  registerDefaultConfig();
  const geoserverUrl = configMock.get<string>('geoserver.url') + '/rest';

  beforeEach(function () {
    registerDefaultConfig();
    geoserverManager = new GeoserverClient(configMock, jsLogger({ enabled: false }), testTracer);
    featureTypesManager = new FeatureTypesManager(jsLogger({ enabled: false }), configMock, testTracer, geoserverManager);
  });

  afterEach(() => {
    nock.cleanAll();
    clearConfig();
    jest.resetAllMocks();
  });

  describe('get featureTypes', () => {
    it('should return a list of featureType names when list=all', async function () {
      nock(geoserverUrl)
        .get('/workspaces/test/datastores/bestStore/featuretypes')
        .query({ list: ListParam.ALL })
        .reply(200, geoserverFeatureTypesListAllResponseMock);
      const featureTypes = await featureTypesManager.getFeatureTypes('test', 'bestStore', ListParam.ALL);

      expect(featureTypes).toEqual(featureTypesListAllResponseMock);
    });

    it('should return a list of featureType names and links when list=configured', async function () {
      nock(geoserverUrl)
        .get('/workspaces/test/datastores/bestStore/featuretypes')
        .query({ list: ListParam.CONFIGURED })
        .reply(200, geoserverFeatureTypesListConfiguredResponseMock);
      const featureTypes = await featureTypesManager.getFeatureTypes('test', 'bestStore', ListParam.CONFIGURED);

      expect(featureTypes).toEqual(featureTypesListConfiguredResponseMock);
    });

    it('should throw not found error when there is not such workspace or datastore', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores/bestStore/featuretypes').query({ list: ListParam.ALL }).reply(404);

      const action = async () => {
        await featureTypesManager.getFeatureTypes('test', 'bestStore', ListParam.ALL);
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });
  });

  describe('get featureType', () => {
    it('should return a featureType', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores/bestStore/featuretypes/bestFeature').reply(200, geoserverGetFeatureTypeResponseMock);
      const featureType = await featureTypesManager.getFeatureType('test', 'bestStore', 'bestFeature');

      expect(featureType).toEqual(getFeatureTypeResponseMock);
    });

    it('should throw not found error when featureType doesnt exist', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores/bestStore/featuretypes/bestFeature').reply(404);
      const action = async () => {
        await featureTypesManager.getFeatureType('test', 'bestStore', 'bestFeature');
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });

    it('should throw not found error when workspace or dataStore doesnt exists', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores/bestStore/featuretypes/bestFeature').reply(404);
      const action = async () => {
        await featureTypesManager.getFeatureType('test', 'bestStore', 'bestFeature');
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });
  });

  describe('Delete featureType', () => {
    it('should delete a featureType with recursive is set to false', async function () {
      nock(geoserverUrl).delete('/workspaces/test/datastores/bestStore/featuretypes/bestFeature').query({ recurse: false }).reply(200);

      const action = async () => {
        await featureTypesManager.deleteFeatureType('test', 'bestStore', 'bestFeature', false);
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should delete a featureType with recursive is set to true', async function () {
      nock(geoserverUrl).delete('/workspaces/test/datastores/bestStore/featuretypes/bestFeature').query({ recurse: true }).reply(200);

      const action = async () => {
        await featureTypesManager.deleteFeatureType('test', 'bestStore', 'bestFeature', true);
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should throw forbidden error when recursive is set to false and featureType has dependencies', async function () {
      nock(geoserverUrl).delete('/workspaces/test/datastores/bestStore/featuretypes/bestFeature').query({ recurse: false }).reply(403);

      const action = async () => {
        await featureTypesManager.deleteFeatureType('test', 'bestStore', 'bestFeature', false);
      };
      await expect(action()).rejects.toThrow(ForbiddenError);
    });

    it('should throw not found error when not such workspace, dataStore or featureType', async function () {
      nock(geoserverUrl).delete('/workspaces/test/datastores/bestStore/featuretypes/bestFeature').query({ recurse: false }).reply(404);

      const action = async () => {
        await featureTypesManager.deleteFeatureType('test', 'bestStore', 'bestFeature', false);
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });
  });

  describe('create featureType', () => {
    it('should create a featureType', async function () {
      nock(geoserverUrl).post('/workspaces/test/datastores/bestStore/featuretypes', geoserverPostFeatureTypeRequestMock).reply(201);
      nock(geoserverUrl)
        .get('/workspaces/test/datastores/bestStore/featuretypes')
        .query({ list: ListParam.ALL })
        .reply(200, geoserverFeatureTypesListAllResponseMock);
      nock(geoserverUrl)
        .get('/workspaces/test/datastores/bestStore/featuretypes')
        .query({ list: ListParam.CONFIGURED })
        .reply(200, { featureTypes: {} });
      const action = async () => {
        await featureTypesManager.createFeatureType('test', 'bestStore', postFeatureTypeRequestMock);
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should throw not found error when tableName doesnt exist', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores/bestStore/featuretypes').query({ list: ListParam.ALL }).reply(200, { list: {} });
      const action = async () => {
        await featureTypesManager.createFeatureType('test', 'bestStore', postFeatureTypeRequestMock);
      };
      await expect(action()).rejects.toThrow(UnprocessableEntityError);
    });

    it('should throw conflict error when featureType with the same name already exists', async function () {
      nock(geoserverUrl)
        .get('/workspaces/test/datastores/bestStore/featuretypes')
        .query({ list: ListParam.ALL })
        .reply(200, geoserverFeatureTypesListAllResponseMock);
      nock(geoserverUrl)
        .get('/workspaces/test/datastores/bestStore/featuretypes')
        .query({ list: ListParam.CONFIGURED })
        .reply(200, geoserverFeatureTypesListConfiguredResponseMock);
      const action = async () => {
        await featureTypesManager.createFeatureType('test', 'bestStore', postFeatureTypeRequestMock);
      };
      await expect(action()).rejects.toThrow(ConflictError);
    });

    it('should throw not found error when not such workspace or dataStore', async function () {
      nock(geoserverUrl).post('/workspaces/test/datastores/bestStore/featuretypes', geoserverPostFeatureTypeRequestMock).reply(404);
      nock(geoserverUrl)
        .get('/workspaces/test/datastores/bestStore/featuretypes')
        .query({ list: ListParam.ALL })
        .reply(200, geoserverFeatureTypesListAllResponseMock);
      nock(geoserverUrl)
        .get('/workspaces/test/datastores/bestStore/featuretypes')
        .query({ list: ListParam.CONFIGURED })
        .reply(200, { featureTypes: {} });
      const action = async () => {
        await featureTypesManager.createFeatureType('test', 'bestStore', postFeatureTypeRequestMock);
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });
  });
});
