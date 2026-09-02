"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const generate_embeddings_processor_1 = require("../processor/generate_embeddings.processor");
exports.photoWorker = new bullmq_1.Worker("generate-embeddings", generate_embeddings_processor_1.generatedEmbedding, {
    connection: redis_1.connection,
    concurrency: 5
});
//# sourceMappingURL=generate_embeddings.worker.js.map