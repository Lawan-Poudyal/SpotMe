import { Router } from 'express';
import { deletePhotoHandler, getPhotoHandler } from '../controllers/photoController';
import { checkParticipant } from '../middlewares/participantHandler';
const photoRouter = Router();

photoRouter.use(checkParticipant);
photoRouter.route('/').get(getPhotoHandler);
photoRouter.route('/delete').delete(deletePhotoHandler);

export { photoRouter };
