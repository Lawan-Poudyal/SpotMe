import { Router } from 'express';
import { checkParticipant } from '../middlewares/participantHandler';
import { deletePhotoHandler, getPhotoHandler , getSingularPhotoHandler, getMyPhotosHandler} from '../controllers/photoController';
const photoRouter = Router();

photoRouter.use(checkParticipant);
photoRouter.route('/').get(getPhotoHandler);
photoRouter.route('/single').get(getSingularPhotoHandler);
photoRouter.route('/delete').delete(deletePhotoHandler);
photoRouter.route('/mine').get(getMyPhotosHandler);

export { photoRouter };
