"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const participantCountController_1 = require("../controllers/participantCountController");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/:eventId/:ownerId', participantCountController_1.getParticipants);
//# sourceMappingURL=participantRoute.js.map