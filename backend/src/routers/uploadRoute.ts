import { Router } from 'express';
import { saveUploadRequest, signedUploadRequest , saveUploadRequestSingular} from '../controllers/uploadController';
const uploadrouter = Router();

uploadrouter.route('/sign').post(signedUploadRequest);
uploadrouter.route('/save').post(saveUploadRequest);
uploadrouter.route('/save/singular').post(saveUploadRequestSingular);

export { uploadrouter };
