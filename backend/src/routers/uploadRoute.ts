import { Router } from 'express';
import { saveUploadRequest, signedUploadRequest } from '../controllers/uploadController';
import { checkParticipant } from '../middlewares/participantHandler';
const uploadrouter = Router();

uploadrouter.use(checkParticipant);
uploadrouter.route('/sign').post(signedUploadRequest);
uploadrouter.route('/save').post(saveUploadRequest);

export { uploadrouter };
