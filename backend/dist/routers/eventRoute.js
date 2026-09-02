"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const router = express_1.default.Router({ mergeParams: true });
exports.router = router;
router
    .route('/')
    .post(eventController_1.createEventHandler)
    .get(eventController_1.getEventHandler)
    .put(eventController_1.updateEventHandler)
    .delete(eventController_1.deleteEventHandler);
router.route('/:eventId').get(eventController_1.getEventById);
//# sourceMappingURL=eventRoute.js.map