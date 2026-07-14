import { Router } from 'express';
import {
  deletePhotoHandler,
  getPhotoHandler,
  getSingularPhotoHandler,
  getMyPhotosHandler,
} from '../controllers/photoController';
const photoRouter = Router();

photoRouter.route('/').get(getPhotoHandler);
photoRouter.route('/single').get(getSingularPhotoHandler);
photoRouter.route('/delete').delete(deletePhotoHandler);
photoRouter.route('/mine').get(getMyPhotosHandler);

export { photoRouter };
