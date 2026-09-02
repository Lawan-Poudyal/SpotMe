"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoRouter = void 0;
const express_1 = require("express");
const participantHandler_1 = require("../middlewares/participantHandler");
const photoController_1 = require("../controllers/photoController");
const photoRouter = (0, express_1.Router)();
exports.photoRouter = photoRouter;
photoRouter.use(participantHandler_1.checkParticipant);
photoRouter.route('/').get(photoController_1.getPhotoHandler);
photoRouter.route('/single').get(photoController_1.getSingularPhotoHandler);
photoRouter.route('/delete').delete(photoController_1.deletePhotoHandler);
photoRouter.route('/thumbnailDelete').delete(photoController_1.deleteThumbnailHandler);
photoRouter.route('/mine').get(photoController_1.getMyPhotosHandler);
//# sourceMappingURL=photoRoute.js.map