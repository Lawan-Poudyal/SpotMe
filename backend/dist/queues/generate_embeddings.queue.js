"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddingQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.embeddingQueue = new bullmq_1.Queue('generate-embeddings', {
    connection: redis_1.connection,
    defaultJobOptions: {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: true
    }
});
//# sourceMappingURL=generate_embeddings.queue.js.map