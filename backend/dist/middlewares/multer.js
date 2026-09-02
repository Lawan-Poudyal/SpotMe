"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const Error_1 = require("../errors/Error");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    console.log({ file });
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error_1.AppError('File type not allowed'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter,
});
exports.default = upload;
//# sourceMappingURL=multer.js.map