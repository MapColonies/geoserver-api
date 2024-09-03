import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import nock from 'nock';
import { ConflictError, NotFoundError } from '@map-colonies/error-types';
import { WorkspacesManager } from '../../../../src/workspaces/models/workspacesManager';
import { GeoserverClient } from '../../../../src/serviceClients/geoserverClient';
import { configMock, registerDefaultConfig, clear as clearConfig } from '../../../mocks/configMock';
import {
  geoserverGetWorkspaceResponseMock,
  geoserverWorkspacesResponseMock,
  getWorkspaceResponseMock,
  getWorkspacesResponseMock,
  postWorkspaceRequest,
} from '../../../mocks/workspacesMocks';

describe('WorkspacesManager', () => {
  let workspacesManager: WorkspacesManager;
  let geoserverManager: GeoserverClient;
  const testTracer = trace.getTracer('testTracer');
  registerDefaultConfig();
  const geoserverUrl = configMock.get<string>('services.geoserverUrl');
  const username = configMock.get<string>('geoserver.auth.username');
  const password = configMock.get<string>('geoserver.auth.password');

  beforeEach(function () {
    registerDefaultConfig();
    geoserverManager = new GeoserverClient(configMock, jsLogger({ enabled: false }), testTracer);
    workspacesManager = new WorkspacesManager(jsLogger({ enabled: false }), configMock, testTracer, geoserverManager);
  });

  afterEach(() => {
    nock.cleanAll();
    clearConfig();
    jest.resetAllMocks();
  });

  describe('getWorkspaces', () => {
    it('should return an array of workspaces', async function () {
      nock(geoserverUrl).get('/workspaces').basicAuth({ user: username, pass: password }).reply(200, geoserverWorkspacesResponseMock);
      const workspaces = await workspacesManager.getWorkspaces();

      expect(workspaces).toEqual(getWorkspacesResponseMock);
    });
  });

  describe('getWorkspace', () => {
    it('should return a new workspace', async function () {
      nock(geoserverUrl).get('/workspaces/test').basicAuth({ user: username, pass: password }).reply(200, geoserverGetWorkspaceResponseMock);
      const workspace = await workspacesManager.getWorkspace('test');

      expect(workspace).toEqual(getWorkspaceResponseMock);
    });

    it('should throw notFound error on non existent workspace', async function () {
      nock(geoserverUrl).get('/workspaces/test').basicAuth({ user: username, pass: password }).reply(404);
      const action = async () => {
        await workspacesManager.getWorkspace('test');
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });
  });

  describe('create Workspace', () => {
    it('should create a workspace', async function () {
      nock(geoserverUrl).post('/workspaces', postWorkspaceRequest).basicAuth({ user: username, pass: password }).reply(201);
      const action = async () => {
        await workspacesManager.createWorkspace('test');
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should throw a conflict error on duplicate workspace creation', async function () {
      nock(geoserverUrl).post('/workspaces', postWorkspaceRequest).basicAuth({ user: username, pass: password }).reply(409);
      const action = async () => {
        await workspacesManager.createWorkspace('test');
      };
      await expect(action()).rejects.toThrow(ConflictError);
    });
  });

  describe('update Workspace', () => {
    it('should update a workspace name', async function () {
      nock(geoserverUrl).get('/workspaces/test').basicAuth({ user: username, pass: password }).reply(404);
      nock(geoserverUrl)
        .put('/workspaces/test1', postWorkspaceRequest)
        .basicAuth({ user: username, pass: password })
        .reply(201, geoserverGetWorkspaceResponseMock);
      const action = async () => {
        await workspacesManager.updateWorkspace('test1', 'test');
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should throw notFound Error when thw workspace doesnt exists', async function () {
      nock(geoserverUrl).get('/workspaces/test').basicAuth({ user: username, pass: password }).reply(404);
      nock(geoserverUrl).put('/workspaces/test1', postWorkspaceRequest).basicAuth({ user: username, pass: password }).reply(404);
      const action = async () => {
        await workspacesManager.updateWorkspace('test1', 'test');
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });

    it('should throw conflict Error when there is a workspace with the new name', async function () {
      nock(geoserverUrl).get('/workspaces/test').basicAuth({ user: username, pass: password }).reply(200, geoserverGetWorkspaceResponseMock);
      nock(geoserverUrl).put('/workspaces/test1', postWorkspaceRequest).basicAuth({ user: username, pass: password }).reply(409);
      const action = async () => {
        await workspacesManager.updateWorkspace('test1', 'test');
      };
      await expect(action()).rejects.toThrow(ConflictError);
    });

    it('should throw internalServer Error when there is an unexpected error in geoserver', async function () {
      nock(geoserverUrl).get('/workspaces/test').basicAuth({ user: username, pass: password }).reply(500);
      const action = async () => {
        await workspacesManager.updateWorkspace('test1', 'test');
      };
      await expect(action()).rejects.toThrow(Error);
    });
  });

  describe('Delete Workspace', () => {
    it('should delete a workspace with recursive is set to false', async function () {
      nock(geoserverUrl).delete('/workspaces/test').query({ recurse: false }).basicAuth({ user: username, pass: password }).reply(200, []);

      const action = async () => {
        await workspacesManager.deleteWorkspace('test', false);
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should delete a workspace with recursive is set to true', async function () {
      nock(geoserverUrl).delete('/workspaces/test').query({ recurse: true }).basicAuth({ user: username, pass: password }).reply(200, []);

      const action = async () => {
        await workspacesManager.deleteWorkspace('test', true);
      };
      await expect(action()).resolves.not.toThrow();
    });

    it('should throw notFound error when there is not such workspace', async function () {
      nock(geoserverUrl).delete('/workspaces/test').query({ recurse: true }).basicAuth({ user: username, pass: password }).reply(404);

      const action = async () => {
        await workspacesManager.deleteWorkspace('test', true);
      };
      await expect(action()).rejects.toThrow(NotFoundError);
    });
  });
});
