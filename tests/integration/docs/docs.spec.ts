import httpStatusCodes from 'http-status-codes';
import { getApp } from '../../../src/app';
import { getTestContainerConfig, resetContainer } from '../testContainerConfig';
import { DocsRequestSender } from './helpers/docsRequestSender';

describe('docs', function () {
  let requestSender: DocsRequestSender;
  beforeEach(async function () {
    const [app] = await getApp({
      override: await getTestContainerConfig(),
      useChild: true,
    });
    requestSender = new DocsRequestSender(app);
  });

  afterEach(function () {
    resetContainer();
    jest.restoreAllMocks();
  });

  describe('Happy Path', function () {
    it('should return 200 status code and the resource', async function () {
      const response = await requestSender.getDocs();

      expect(response.status).toBe(httpStatusCodes.OK);
      expect(response.type).toBe('text/html');
    });

    it('should return 200 status code and the json spec', async function () {
      const response = await requestSender.getDocsJson();

      expect(response.status).toBe(httpStatusCodes.OK);

      expect(response.type).toBe('application/json');
      expect(response.body).toHaveProperty('openapi');
    });
  });
});
