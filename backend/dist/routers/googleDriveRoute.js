"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const asyncGooglePhotoUploadController_1 = require("../controllers/asyncGooglePhotoUploadController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.router = router;
router.route("/").post(asyncGooglePhotoUploadController_1.createPhotoHandler);
router.route("/referencePhoto").post(asyncGooglePhotoUploadController_1.createReferencePhotoHandler);
//# sourceMappingURL=googleDriveRoute.js.map