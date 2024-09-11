import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import nock from 'nock';
import { ConflictError, NotFoundError } from '@map-colonies/error-types';
import { DataStoresManager } from '../../../../src/dataStores/models/dataStoresManager';
import { GeoserverClient } from '../../../../src/serviceClients/geoserverClient';
import { configMock, registerDefaultConfig, clear as clearConfig } from '../../../mocks/configMock';
// import {
//   geoserverGetWorkspaceResponseMock,
//   geoserverWorkspacesResponseMock,
//   getWorkspaceResponseMock,
//   getWorkspacesResponseMock,
//   postWorkspaceRequest,
// } from '../../../mocks/workspacesMocks';
import { WorkspacesManager } from '../../../../src/workspaces/models/workspacesManager';
import {
  createDataStoreBody,
  geoserverDataStoresResponseMock,
  geoserverGetDataStoreResponseMock,
  getDataStoreResponseMock,
  getDataStoresResponseMock,
  postDataStoreRequest,
  putDataStoreRequest,
  updateDataStoreBody,
} from '../../../mocks/dataStoresMocks';
import { geoserverGetWorkspaceResponseMock } from '../../../mocks/workspacesMocks';

describe('DataStoresManager', () => {
  let dataStoresManager: DataStoresManager;
  let workspacesManager: WorkspacesManager;
  let geoserverManager: GeoserverClient;
  const testTracer = trace.getTracer('testTracer');
  registerDefaultConfig();
  const geoserverUrl = configMock.get<string>('geoserver.url');

  beforeEach(function () {
    registerDefaultConfig();
    geoserverManager = new GeoserverClient(configMock, jsLogger({ enabled: false }), testTracer);
    workspacesManager = new WorkspacesManager(jsLogger({ enabled: false }), configMock, testTracer, geoserverManager);
    dataStoresManager = new DataStoresManager(jsLogger({ enabled: false }), configMock, testTracer, geoserverManager, workspacesManager);
  });

  afterEach(() => {
    nock.cleanAll();
    clearConfig();
    jest.resetAllMocks();
  });

  describe('get dataStores', () => {
    it('should return an array of dataStore', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores').reply(200, geoserverDataStoresResponseMock);
      const datsStores = await dataStoresManager.getDataStores('test');

      expect(datsStores).toEqual(getDataStoresResponseMock);
    });
  });

  describe('get dataStore', () => {
    it('should return a dataStore', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores/polygon_parts').reply(200, geoserverGetDataStoreResponseMock);
      const datsStore = await dataStoresManager.getDataStore('test', 'polygon_parts');

      expect(datsStore).toEqual(getDataStoreResponseMock);
    });

    it('should throw notFound error on non existent workspace or dataStore', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores/polygon_parts').reply(404);
      const action = async () => {
        await dataStoresManager.getDataStore('test', 'polygon_parts');
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });
  });

  describe('Delete dataStore', () => {
    it('should delete a dataStore with recursive is set to false', async function () {
      nock(geoserverUrl).delete('/workspaces/test/datastores/polygon_parts').query({ recurse: false }).reply(200, []);

      const action = async () => {
        await dataStoresManager.deleteDataStore('test', 'polygon_parts', false);
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should throw notFound error when there is not such workspace or datastore', async function () {
      nock(geoserverUrl).delete('/workspaces/test/datastores/polygon_parts').query({ recurse: true }).reply(404);

      const action = async () => {
        await dataStoresManager.deleteDataStore('test', 'polygon_parts', true);
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });
  });

  describe('create dataStore', () => {
    it('should create a dataStore', async function () {
      nock(geoserverUrl).post('/workspaces/test/datastores', postDataStoreRequest).reply(201);
      nock(geoserverUrl).get('/workspaces/test').reply(200, geoserverGetWorkspaceResponseMock);
      nock(geoserverUrl).get('/workspaces/test/datastores/polygon_parts').reply(404);

      const action = async () => {
        await dataStoresManager.createDataStore('test', createDataStoreBody);
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should throw a notFound error when workspace doesnt exists', async function () {
      nock(geoserverUrl).post('/workspaces/test/datastores', postDataStoreRequest).reply(201);
      nock(geoserverUrl).get('/workspaces/test').reply(404);

      const action = async () => {
        await dataStoresManager.createDataStore('test', createDataStoreBody);
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });

    it('should throw a conflict error when dataStore already exists', async function () {
      nock(geoserverUrl).post('/workspaces/test/datastores', postDataStoreRequest).reply(201);
      nock(geoserverUrl).get('/workspaces/test').reply(200, geoserverGetWorkspaceResponseMock);
      nock(geoserverUrl).get('/workspaces/test/datastores/polygon_parts').reply(200, geoserverGetDataStoreResponseMock);

      const action = async () => {
        await dataStoresManager.createDataStore('test', createDataStoreBody);
      };
      await expect(action()).rejects.toThrow(ConflictError);
    });
  });

  describe('update dataStore', () => {
    it('should update a dataStore name', async function () {
      nock(geoserverUrl).put('/workspaces/test/datastores/polygon_parts', putDataStoreRequest).reply(201);
      const action = async () => {
        await dataStoresManager.updateDataStore('test', 'polygon_parts', updateDataStoreBody);
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should throw a notFound error when workspace doesnt exists', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores/polygon_parts1').reply(404);
      nock(geoserverUrl).put('/workspaces/test/datastores/polygon_parts', putDataStoreRequest).reply(404);
      const action = async () => {
        await dataStoresManager.updateDataStore('test', 'polygon_parts', updateDataStoreBody);
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });

    it('should throw a conflict error when a dataStore under the new name already exists', async function () {
      nock(geoserverUrl).get('/workspaces/test/datastores/polygon_parts1').reply(200, geoserverGetDataStoreResponseMock);
      const action = async () => {
        await dataStoresManager.updateDataStore('test', 'polygon_parts', updateDataStoreBody);
      };
      await expect(action()).rejects.toThrow(ConflictError);
    });
  });
});
