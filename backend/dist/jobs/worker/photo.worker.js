"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const photo_processor_1 = require("../processor/photo.processor");
exports.photoWorker = new bullmq_1.Worker("photo-processing", photo_processor_1.processPhotoJob, {
    connection: redis_1.connection,
    concurrency: 5
});
//# sourceMappingURL=photo.worker.js.map