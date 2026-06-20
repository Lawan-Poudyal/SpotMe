import express from 'express';
import { saveUploadRequest, signedUploadRequest } from '../controllers/uploadController';
const signUploadrouter = express.Router();

signUploadrouter.route('/sign').post(signedUploadRequest);
signUploadrouter.route('/save').post(saveUploadRequest);

export { signUploadrouter };
