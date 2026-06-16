import express from 'express';
import { signedUploadRequest } from '../controllers/signUploadRequest';
const signUploadrouter = express.Router();

signUploadrouter.route('/').post(signedUploadRequest);

export { signUploadrouter };
