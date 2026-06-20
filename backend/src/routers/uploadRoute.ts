import express from 'express';
import { saveUploadRequest, signedUploadRequest } from '../controllers/uploadController';
const uploadrouter = express.Router();

uploadrouter.route('/sign').post(signedUploadRequest);
uploadrouter.route('/save').post(saveUploadRequest);

export { uploadrouter };
