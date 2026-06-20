import express from 'express';
import { getPhotoHandler } from '../controllers/photoController';
const photoRouter = express.Router();

photoRouter.route('/').get(getPhotoHandler);

export { photoRouter };
