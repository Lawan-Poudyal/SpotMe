"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const reference_photo_processor_1 = require("../processor/reference_photo.processor");
exports.photoWorker = new bullmq_1.Worker("reference-photo-processing", reference_photo_processor_1.processPhotoJob, {
    connection: redis_1.connection,
    concurrency: 5
});
//# sourceMappingURL=reference_photo.worker.js.map