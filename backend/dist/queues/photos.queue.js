"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.photoQueue = new bullmq_1.Queue('photo-processing', {
    connection: redis_1.connection,
    defaultJobOptions: {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: true
    }
});
//# sourceMappingURL=photos.queue.js.map