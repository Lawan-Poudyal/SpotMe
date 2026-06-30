import express from 'express';
import { deletePhotoHandler, getPhotoHandler } from '../controllers/photoController';
const photoRouter = express.Router();

photoRouter.route('/').get(getPhotoHandler);
photoRouter.route('/delete').delete(deletePhotoHandler);

export { photoRouter };
