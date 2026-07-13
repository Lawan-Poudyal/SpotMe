import { Router } from 'express';
import { inviteLinkHandler } from '../controllers/eventSharingController';

const shareRouter = Router({ mergeParams: true });

shareRouter.route('/').post(inviteLinkHandler);

export { shareRouter };
