import { Router } from 'express';
import { saveUploadRequest, signedUploadRequest } from '../controllers/uploadController';
const uploadrouter = Router();

uploadrouter.route('/sign').post(signedUploadRequest);
uploadrouter.route('/save').post(saveUploadRequest);

export { uploadrouter };
