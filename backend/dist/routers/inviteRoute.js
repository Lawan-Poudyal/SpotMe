"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareRouter = void 0;
const express_1 = require("express");
const eventSharingController_1 = require("../controllers/eventSharingController");
const shareRouter = (0, express_1.Router)({ mergeParams: true });
exports.shareRouter = shareRouter;
shareRouter.route('/').post(eventSharingController_1.inviteLinkHandler);
//# sourceMappingURL=inviteRoute.js.map