import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { WfsManager } from '../models/wfsManager';
import { WfsSettings } from '../../../common/interfaces';

type GetWfsSettingsHandler = RequestHandler<undefined, WfsSettings, unknown>;
type UpdateWorkspaceHandler = RequestHandler<undefined, unknown, WfsSettings>;

@injectable()
export class WfsController {
  public constructor(private readonly wfsManager: WfsManager) {}

  public getWfsMode: GetWfsSettingsHandler = async (req, res, next) => {
    try {
      const wfsMode = await this.wfsManager.getWfsSettings();
      res.status(StatusCodes.OK).send(wfsMode);
    } catch (error) {
      next(error);
    }
  };

  public updateWfsMode: UpdateWorkspaceHandler = async (req, res, next) => {
    try {
      const { serviceLevel, maxFeatures } = req.body;
      await this.wfsManager.updateWfsMode(serviceLevel, maxFeatures);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      next(error);
    }
  };
}
