import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { WfsManager } from '../models/wfsManager';
import { WfsMode } from '../../../common/interfaces';

type GetWfsModeHandler = RequestHandler<undefined, WfsMode, unknown>;
type UpdateWorkspaceHandler = RequestHandler<undefined, unknown, WfsMode>;

@injectable()
export class WfsController {
  public constructor(private readonly wfsManager: WfsManager) {}

  public getWfsMode: GetWfsModeHandler = async (req, res, next) => {
    try {
      const wfsMode = await this.wfsManager.getWfsMode();
      res.status(StatusCodes.OK).send(wfsMode);
    } catch (error) {
      next(error);
    }
  };

  public updateWfsMode: UpdateWorkspaceHandler = async (req, res, next) => {
    try {
      const { serviceLevel } = req.body;
      await this.wfsManager.updateWfsMode(serviceLevel);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      next(error);
    }
  };
}
