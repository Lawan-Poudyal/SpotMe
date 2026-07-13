import { Router } from 'express';
import { checkParticipant } from '../middlewares/participantHandler';
import { saveUploadRequest, signedUploadRequest , saveUploadRequestSingular} from '../controllers/uploadController';
const uploadrouter = Router();

uploadrouter.use(checkParticipant);
uploadrouter.route('/sign').post(signedUploadRequest);
uploadrouter.route('/save').post(saveUploadRequest);
uploadrouter.route('/save/singular').post(saveUploadRequestSingular);

export { uploadrouter };
