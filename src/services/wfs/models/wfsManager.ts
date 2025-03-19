import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { Tracer } from '@opentelemetry/api';
import { withSpanAsyncV4 } from '@map-colonies/telemetry';
import { SERVICES } from '../../../common/constants';
import { IConfig, WfsSettings } from '../../../common/interfaces';
import { GeoserverClient } from '../../../serviceClients/geoserverClient';
import { WfsServiceLevel } from '../../../common/enums';
import { updateWfsModeRequestConverter } from '../../../utils/convertors/requestConverter';
import { GeoServerGetWfsSettingsResponse } from '../../../common/geoserver/models/wfsMode';
import { getWfsModeResponseConverter } from '../../../utils/convertors/responseConverter';

@injectable()
export class WfsManager {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer,
    private readonly geoserverManager: GeoserverClient
  ) {}

  @withSpanAsyncV4
  public async getWfsSettings(): Promise<WfsSettings> {
    this.logger.info({ msg: 'getting wfsSettings' });
    const geoserverResponse = await this.geoserverManager.getRequest<GeoServerGetWfsSettingsResponse>('services/wfs/settings');
    const response = getWfsModeResponseConverter(geoserverResponse);
    return response;
  }

  @withSpanAsyncV4
  public async updateWfsMode(serviceLevel: WfsServiceLevel, maxFeatures?: number): Promise<void> {
    const wfsMaxFeaturesToUpdate = maxFeatures ?? this.config.get<number>('geoserver.wfsMaxFeatures');
    this.logger.info({ msg: `updating wfsMode to : ${serviceLevel} with maxFeatures: ${maxFeatures}` });
    const wfsSettingsRequest = updateWfsModeRequestConverter(serviceLevel, wfsMaxFeaturesToUpdate);
    await this.geoserverManager.putRequest(`services/wfs/settings`, wfsSettingsRequest);
  }
}
