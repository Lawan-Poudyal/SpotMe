"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinRouter = void 0;
const express_1 = require("express");
const eventSharingController_1 = require("../controllers/eventSharingController");
const joinRouter = (0, express_1.Router)({ mergeParams: true });
exports.joinRouter = joinRouter;
joinRouter.route('/').post(eventSharingController_1.joinEventHandler);
//# sourceMappingURL=joinRouter.js.map