import { Logger } from '@map-colonies/js-logger';
import { NotFoundError } from '@map-colonies/error-types';
import { HttpClient, IHttpRetryConfig } from '@map-colonies/mc-utils';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { AxiosBasicCredentials } from 'axios';
import { IConfig } from '../common/interfaces';
import { SERVICES } from '../common/constants';
import { LogContext } from '../utils/logger/logContext';
import { withSpanAsyncV4 } from '../common/test';

interface RequestOptions<T> {
  queryParams?: T;
  headers?: Record<string, string | number | boolean | null>;
}

@injectable()
export class GeoserverClient extends HttpClient {
  private readonly auth: AxiosBasicCredentials;
  private readonly logContext: LogContext;

  public constructor(
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.LOGGER) protected readonly logger: Logger,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer
  ) {
    super(
      logger,
      config.get<string>('geoserver.url'),
      'GeoServer',
      config.get<IHttpRetryConfig>('httpRetry'),
      config.get<boolean>('disableHttpClientLogs')
    );
    this.auth = {
      username: config.get<string>('geoserver.auth.username'),
      password: config.get<string>('geoserver.auth.password'),
    };
    this.logContext = {
      fileName: __filename,
      class: GeoserverClient.name,
    };
  }

  /**
   * Executes an HTTP GET request to the specified GeoServer endpoint.
   *
   * This method constructs a request URL using the provided endpoint and appends optional query parameters and headers.
   * It authenticates the request using basic credentials from the GeoServer configuration.
   *
   * @template T The expected response type from the GeoServer.
   * @template P The type of the query parameters object, which extends `Record<string, unknown>`. Defaults to an empty object.
   * @param {string} endpoint - The specific endpoint within the GeoServer to which the request is sent (e.g., "workspaces/default/layers").
   * @param {RequestOptions<P>} [options] - Optional configuration for the request, which may include:
   *   - `queryParams`: A record of key-value pairs to be appended as query parameters, typed as `P`.
   *   - `headers`: A record of custom headers for the request, such as `Authorization`, `Accept`, or `Content-Type`.
   *
   * @returns {Promise<T>} A promise resolving to the response data of type `T` from the GeoServer.
   *
   * @throws Will throw an error if the request fails. If the resource is not found, it throws a `NotFoundError` with an updated message containing the endpoint.
   */
  @withSpanAsyncV4
  public async getRequest<T, P extends Record<string, unknown> = Record<string, unknown>>(endpoint: string, options?: RequestOptions<P>): Promise<T> {
    const logCtx: LogContext = { ...this.logContext, function: this.getRequest.name };
    const url = `${this.baseUrl}/${endpoint}`;
    try {
      const response = await this.get<T>(url, options?.queryParams, undefined, this.auth, options?.headers);
      return response;
    } catch (error) {
      this.logger.error({ msg: `Failed to perform GET request to ${url}`, logContext: logCtx, error: error });
      if (error instanceof NotFoundError) {
        error.message = `No resource was found for get of ${endpoint}`;
      }
      throw error;
    }
  }

  /**
   * Executes an HTTP POST request to the specified GeoServer endpoint.
   *
   * This method sends a request to the provided endpoint, including an optional request body and any optional query parameters and headers.
   * It uses basic authentication credentials retrieved from the GeoServer configuration.
   *
   * @template T The expected response type from the GeoServer.
   * @template P The type of the query parameters object, which extends `Record<string, unknown>`.
   * @param {string} endpoint - The specific endpoint within the GeoServer to which the request is sent (e.g., "workspaces/default/layers").
   * @param {unknown} [body] - The body of the POST request, if applicable. This can be used to send data (e.g., JSON objects).
   * @param {RequestOptions<P>} [options] - Optional request settings, including:
   *   - `queryParams`: Key-value pairs to append as query parameters, typed as `P`.
   *   - `headers`: Custom headers for the request.
   *
   * @returns {Promise<T>} A promise resolving to the response data of type `T` from the GeoServer.
   *
   * @throws Will throw an error if the request fails.
   */
  @withSpanAsyncV4
  public async postRequest<T, P extends Record<string, unknown>>(endpoint: string, body?: unknown, options?: RequestOptions<P>): Promise<T> {
    const logCtx: LogContext = { ...this.logContext, function: this.postRequest.name };
    const url = `${this.baseUrl}/${endpoint}`;
    try {
      const response = await this.post<T>(url, body, options?.queryParams, undefined, this.auth, options?.headers);
      return response;
    } catch (error) {
      this.logger.error({ msg: `Failed to perform POST request to ${url}`, logContext: logCtx, error: error });
      throw error;
    }
  }

  /**
   * Executes an HTTP DELETE request to the specified GeoServer endpoint.
   *
   * This method sends a DELETE request to the provided endpoint, with optional query parameters and headers.
   * It uses basic authentication credentials from the GeoServer configuration.
   *
   * @template T The type of the query parameters object, which extends `Record<string, unknown>`.
   * @param {string} endpoint - The specific endpoint within the GeoServer to which the request is sent (e.g., "layers/default/layerName").
   * @param {RequestOptions<T>} [options] - Optional settings for the request, including:
   *   - `queryParams`: Key-value pairs to append as query parameters, typed as `T`.
   *   - `headers`: Custom headers for the request.
   *
   * @returns {Promise<void>} A promise resolving when the delete request is completed.
   *
   * @throws Will throw an error if the request fails. If the resource is not found, it throws a `NotFoundError` with an updated message containing the endpoint.
   */
  @withSpanAsyncV4
  public async deleteRequest<T extends Record<string, unknown>>(endpoint: string, options?: RequestOptions<T>): Promise<void> {
    const logCtx: LogContext = { ...this.logContext, function: this.deleteRequest.name };
    const url = `${this.baseUrl}/${endpoint}`;
    try {
      await this.delete(url, options?.queryParams, undefined, this.auth, options?.headers);
    } catch (error) {
      this.logger.error({ msg: `Failed to perform DELETE request to ${url}`, logContext: logCtx, error: error });
      if (error instanceof NotFoundError) {
        error.message = `No resource was found for delete of ${endpoint}`;
      }
      throw error;
    }
  }

  /**
   * Executes an HTTP PUT request to the specified GeoServer endpoint.
   *
   * This method sends a PUT request to the provided endpoint, with an optional body, query parameters, and headers.
   * It uses basic authentication credentials from the GeoServer configuration.
   *
   * @template T The expected response type from the GeoServer.
   * @template P The type of the query parameters object, which extends `Record<string, unknown>`.
   * @param {string} endpoint - The specific endpoint within the GeoServer to which the request is sent (e.g., "workspaces/default/layers").
   * @param {unknown} [body] - The body of the PUT request, if applicable, for updating or replacing resources.
   * @param {RequestOptions<P>} [options] - Optional settings for the request, including:
   *   - `queryParams`: Key-value pairs to append as query parameters, typed as `P`.
   *   - `headers`: Custom headers for the request.
   *
   * @returns {Promise<T>} A promise resolving to the updated or replaced resource of type `T`.
   *
   * @throws Will throw an error if the request fails. If the resource is not found, it throws a `NotFoundError` with an updated message containing the endpoint.
   */
  @withSpanAsyncV4
  public async putRequest<T, P extends Record<string, unknown>>(endpoint: string, body?: unknown, options?: RequestOptions<P>): Promise<T> {
    const logCtx: LogContext = { ...this.logContext, function: this.putRequest.name };
    const url = `${this.baseUrl}/${endpoint}`;
    try {
      const response = await this.put<T>(url, body, options?.queryParams, undefined, this.auth, options?.headers);
      return response;
    } catch (error) {
      this.logger.error({ msg: `Failed to perform PUT request to ${url}`, logContext: logCtx, error: error });
      if (error instanceof NotFoundError) {
        error.message = `No resource was found for put of ${endpoint}`;
      }
      throw error;
    }
  }
}
