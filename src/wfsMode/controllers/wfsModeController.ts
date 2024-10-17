import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { WfsModeManager } from '../models/wfsModeManager';
import { WfsMode } from '../../common/interfaces';

type GetWfsModeHandler = RequestHandler<undefined, WfsMode, unknown>;
type UpdateWorkspaceHandler = RequestHandler<undefined, unknown, WfsMode>;

@injectable()
export class WfsModeController {
  public constructor(private readonly wfsModeManager: WfsModeManager) {}

  public getWfsMode: GetWfsModeHandler = async (req, res, next) => {
    try {
      const wfsMode = await this.wfsModeManager.getWfsMode();
      res.status(StatusCodes.OK).send(wfsMode);
    } catch (error) {
      next(error);
    }
  };

  public updateWfsMode: UpdateWorkspaceHandler = async (req, res, next) => {
    try {
      const { serviceLevel } = req.body;
      await this.wfsModeManager.updateWfsMode(serviceLevel);
      res.status(StatusCodes.OK).send();
    } catch (error) {
      next(error);
    }
  };
}
