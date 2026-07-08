import { Router } from 'express';
import { deletePhotoHandler, getPhotoHandler , getSingularPhotoHandler} from '../controllers/photoController';
const photoRouter = Router();

photoRouter.route('/').get(getPhotoHandler);
photoRouter.route('/single').get(getSingularPhotoHandler);
photoRouter.route('/delete').delete(deletePhotoHandler);

export { photoRouter };
