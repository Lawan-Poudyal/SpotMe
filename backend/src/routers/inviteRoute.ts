import express from 'express';
import { inviteLinkHandler } from '../controllers/eventSharingController';
const inviteRouter = express.Router();

inviteRouter.route('/').post(inviteLinkHandler);

export { inviteRouter };
