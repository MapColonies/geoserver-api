import { Logger } from '@map-colonies/js-logger';
import { NotFoundError } from '@map-colonies/error-types';
import { HttpClient, IHttpRetryConfig } from '@map-colonies/mc-utils';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { AxiosBasicCredentials } from 'axios';
import { IConfig } from '../common/interfaces';
import { SERVICES } from '../common/constants';
import { LogContext } from '../utils/logger/logContext';

interface RequestOptions {
  queryParams?: Record<string, unknown>;
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
      config.get<string>('services.geoserverUrl'),
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

  public async getRequest<T>(endpoint: string, options?: RequestOptions): Promise<T> {
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

  public async postRequest<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
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

  public async deleteRequest(endpoint: string, options?: RequestOptions): Promise<void> {
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

  public async putRequest<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
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
