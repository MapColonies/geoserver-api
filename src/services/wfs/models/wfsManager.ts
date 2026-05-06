import type { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import type { Tracer } from '@opentelemetry/api';
import { withSpanAsyncV4 } from '@map-colonies/telemetry';
import { SERVICES } from '../../../common/constants';
import type { ConfigType } from '../../../common/config';
import { WfsSettings } from '../../../common/interfaces';
import { GeoserverClient } from '../../../serviceClients/geoserverClient';
import { WfsServiceLevel } from '../../../common/enums';
import { updateWfsModeRequestConverter } from '../../../utils/convertors/requestConverter';
import { GeoServerGetWfsSettingsResponse } from '../../../common/geoserver/models/wfsMode';
import { getWfsModeResponseConverter } from '../../../utils/convertors/responseConverter';

@injectable()
export class WfsManager {
  public constructor(
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    @inject(SERVICES.CONFIG) private readonly config: ConfigType,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer,
    @inject(GeoserverClient) private readonly geoserverManager: GeoserverClient
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
    const wfsMaxFeaturesFromConfig = this.config.get('geoserver.wfsMaxFeatures');
    const wfsMaxFeaturesToUpdate =
      maxFeatures ?? (typeof wfsMaxFeaturesFromConfig === 'number' ? wfsMaxFeaturesFromConfig : Number(wfsMaxFeaturesFromConfig));
    this.logger.info({ msg: `updating wfsMode to : ${serviceLevel} with maxFeatures: ${maxFeatures}` });
    const wfsSettingsRequest = updateWfsModeRequestConverter(serviceLevel, wfsMaxFeaturesToUpdate);
    await this.geoserverManager.putRequest(`services/wfs/settings`, wfsSettingsRequest);
  }
}
