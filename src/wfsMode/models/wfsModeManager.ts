import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { withSpanAsyncV4 } from '@map-colonies/telemetry';
import { SERVICES } from '../../common/constants';
import { IConfig, WfsMode } from '../../common/interfaces';
import { GeoserverClient } from '../../serviceClients/geoserverClient';
import { WfsServiceLevel } from '../../common/enums';
import { updateWfsModeRequestConverter } from '../../utils/convertors/requestConverter';

@injectable()
export class WfsModeManager {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer,
    private readonly geoserverManager: GeoserverClient
  ) {}

  @withSpanAsyncV4
  public async getWfsMode(): Promise<WfsMode> {
    this.logger.info({ msg: 'getting wfsMode' });
    const geoserverResponse = await this.geoserverManager.getRequest<>('services/wfs/settings');
    const response = workspaceResponseConverter(geoserverResponse);
    return response;
  }

  @withSpanAsyncV4
  public async updateWfsMode(serviceLevel: WfsServiceLevel): Promise<void> {
    this.logger.info({ msg: `updating wfsMode to : ${serviceLevel}` });
    const wfsModeRequest = updateWfsModeRequestConverter(serviceLevel);
    await this.geoserverManager.putRequest(`services/wfs/settings`, wfsModeRequest);
  }
}
