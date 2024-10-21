import httpStatusCodes from 'http-status-codes';
import nock from 'nock';
import { getApp } from '../../../src/app';
import {
  geoserverGetWorkspaceResponseMock,
  geoserverWorkspacesResponseMock,
  getWorkspaceResponseMock,
  postWorkspaceRequest,
} from '../../mocks/workspacesMocks';
import { configMock, registerDefaultConfig } from '../../mocks/configMock';
import { WorkspaceRequestSender } from './helpers/workspacesRequestSender';
import { getTestContainerConfig, resetContainer } from './helpers/containerConfig';

describe('Workspaces', function () {
  let requestSender: WorkspaceRequestSender;
  registerDefaultConfig();
  const geoserverUrl = `${configMock.get<string>('geoserver.url')}/rest`;

  beforeEach(function () {
    const app = getApp({
      override: [...getTestContainerConfig()],
      useChild: true,
    });
    requestSender = new WorkspaceRequestSender(app);
  });

  afterEach(function () {
    nock.cleanAll();
    resetContainer();
    jest.restoreAllMocks();
  });

  describe('getWorkspaces', function () {
    describe('Happy Path', function () {
      it('should return 200 status code and a list of workspaces', async function () {
        nock(geoserverUrl).get('/workspaces').reply(200, geoserverWorkspacesResponseMock);

        const response = await requestSender.getWorkspaces();

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response).toSatisfyApiSpec();
      });
    });

    describe('Sad Path', function () {
      it('should return 401 status on unauthorized', async function () {
        nock(geoserverUrl).get('/workspaces').reply(401);

        const response = await requestSender.getWorkspaces();

        expect(response.status).not.toBe(httpStatusCodes.OK);
        expect(response).toSatisfyApiSpec();
      });
    });
  });

  describe('getWorkspace', function () {
    describe('Happy Path', function () {
      it('should return 200 status code and a single workspace', async function () {
        nock(geoserverUrl).get('/workspaces/test').reply(200, geoserverGetWorkspaceResponseMock);

        const response = await requestSender.getWorkspace('test');

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response.body).toEqual(getWorkspaceResponseMock);
        expect(response).toSatisfyApiSpec();
      });
    });

    describe('Sad Path', function () {
      it('should return 404 status code when there is no such workspace', async function () {
        nock(geoserverUrl).get('/workspaces/test').reply(404);

        const response = await requestSender.getWorkspace('test');

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response).toSatisfyApiSpec();
      });
    });
  });

  describe('createWorkspace', function () {
    describe('Happy Path', function () {
      it('should return 201 status code and a create a new workspace', async function () {
        nock(geoserverUrl).post('/workspaces', postWorkspaceRequest).reply(201);

        const response = await requestSender.createWorkspace(postWorkspaceRequest.workspace);

        expect(response.status).toBe(httpStatusCodes.CREATED);
        expect(response).toSatisfyApiSpec();
      });
    });

    describe('Sad Path', function () {
      it('should return 409 status code on conflicting workspace name', async function () {
        nock(geoserverUrl).post('/workspaces', postWorkspaceRequest).reply(409);

        const response = await requestSender.createWorkspace(postWorkspaceRequest.workspace);

        expect(response.status).toBe(httpStatusCodes.CONFLICT);
        expect(response).toSatisfyApiSpec();
      });
    });
  });

  describe('updateWorkspace', function () {
    describe('Happy Path', function () {
      it('should return 201 status code and modify a workspace', async function () {
        nock(geoserverUrl).put('/workspaces/test1', postWorkspaceRequest).reply(201);
        nock(geoserverUrl).get('/workspaces/test').reply(404);
        const response = await requestSender.updateWorkspace('test1', 'test');

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response).toSatisfyApiSpec();
      });
    });

    describe('Sad Path', function () {
      it('should return 404 status code when there is no workspace to update', async function () {
        nock(geoserverUrl).put('/workspaces/test1', postWorkspaceRequest).reply(404);
        nock(geoserverUrl).get('/workspaces/test').reply(404);
        const response = await requestSender.updateWorkspace('test1', 'test');

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response).toSatisfyApiSpec();
      });

      it('should return 409 status code when there is already a namespace with the new name', async function () {
        nock(geoserverUrl).get('/workspaces/test').reply(200, geoserverGetWorkspaceResponseMock);
        const response = await requestSender.updateWorkspace('test1', 'test');

        expect(response.status).toBe(httpStatusCodes.CONFLICT);
        expect(response).toSatisfyApiSpec();
      });

      it('should return 405 status code when unauthorized to change workspace name', async function () {
        nock(geoserverUrl).put('/workspaces/test1', postWorkspaceRequest).reply(405);
        nock(geoserverUrl).get('/workspaces/test').reply(404);
        const response = await requestSender.updateWorkspace('test1', 'test');

        expect(response.status).toBe(httpStatusCodes.METHOD_NOT_ALLOWED);
        expect(response).toSatisfyApiSpec();
      }, 5000000);
    });
  });

  describe('deleteWorkspace', function () {
    describe('Happy Path', function () {
      it('should return 200 status code delete workspace when recurive is set to false', async function () {
        nock(geoserverUrl).delete('/workspaces/test').query({ recurse: false }).reply(200, []);

        const response = await requestSender.deleteWorkspace('test');

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response).toSatisfyApiSpec();
      });

      it('should return 200 status code and delete workspace when recurive is set to false', async function () {
        nock(geoserverUrl).delete('/workspaces/test').query({ recurse: true }).reply(200, []);

        const response = await requestSender.deleteWorkspace('test', true);

        expect(response.status).toBe(httpStatusCodes.OK);
        expect(response).toSatisfyApiSpec();
      });
    });

    describe('Sad Path', function () {
      it('should return 403 status code when isRecursive is set to false and workspace is not empty', async function () {
        nock(geoserverUrl).delete('/workspaces/test').query({ recurse: false }).reply(403);

        const response = await requestSender.deleteWorkspace('test', false);

        expect(response.status).toBe(httpStatusCodes.FORBIDDEN);
        expect(response).toSatisfyApiSpec();
      });

      it('should return 404 status code when rthere is no such workspace', async function () {
        nock(geoserverUrl).delete('/workspaces/test').query({ recurse: false }).reply(404);

        const response = await requestSender.deleteWorkspace('test', false);

        expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
        expect(response).toSatisfyApiSpec();
      });
    });
  });
});
