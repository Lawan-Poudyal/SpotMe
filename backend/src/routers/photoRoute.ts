import { Router } from 'express';
import { deletePhotoHandler, getPhotoHandler } from '../controllers/photoController';
import { checkParticipant } from '../middlewares/participantHandler';
import { deletePhotoHandler, getPhotoHandler , getSingularPhotoHandler} from '../controllers/photoController';
const photoRouter = Router();

photoRouter.use(checkParticipant);
photoRouter.route('/').get(getPhotoHandler);
photoRouter.route('/single').get(getSingularPhotoHandler);
photoRouter.route('/delete').delete(deletePhotoHandler);

export { photoRouter };
