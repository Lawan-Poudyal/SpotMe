import { Router } from 'express';
import { deletePhotoHandler, getPhotoHandler } from '../controllers/photoController';
const photoRouter = Router();

photoRouter.route('/').get(getPhotoHandler);
photoRouter.route('/delete').delete(deletePhotoHandler);

export { photoRouter };
