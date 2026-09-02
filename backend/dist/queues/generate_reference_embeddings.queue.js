"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceEmbeddingQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.referenceEmbeddingQueue = new bullmq_1.Queue('generate-reference-embeddings', {
    connection: redis_1.connection,
    defaultJobOptions: {
        attempts: 1,
        removeOnComplete: true,
        removeOnFail: true
    }
});
//# sourceMappingURL=generate_reference_embeddings.queue.js.map