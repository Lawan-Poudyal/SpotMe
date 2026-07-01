import { Router } from 'express';
import { joinEventHandler } from '../controllers/eventSharingController';
const joinRouter = Router({ mergeParams: true });

joinRouter.route('/').post(joinEventHandler);

export { joinRouter };
