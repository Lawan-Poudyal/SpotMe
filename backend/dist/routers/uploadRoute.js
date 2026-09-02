"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadrouter = void 0;
const express_1 = require("express");
const participantHandler_1 = require("../middlewares/participantHandler");
const uploadController_1 = require("../controllers/uploadController");
const uploadrouter = (0, express_1.Router)();
exports.uploadrouter = uploadrouter;
uploadrouter.use(participantHandler_1.checkParticipant);
uploadrouter.route('/sign').post(uploadController_1.signedUploadRequest);
uploadrouter.route('/save').post(uploadController_1.saveUploadRequest);
uploadrouter.route('/save/singular').post(uploadController_1.saveUploadRequestSingular);
//# sourceMappingURL=uploadRoute.js.map