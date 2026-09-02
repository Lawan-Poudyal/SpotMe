"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceEmbeddingWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const generate_reference_embeddings_processor_1 = require("../processor/generate_reference_embeddings.processor");
exports.referenceEmbeddingWorker = new bullmq_1.Worker("generate-reference-embeddings", generate_reference_embeddings_processor_1.generatedEmbedding, {
    connection: redis_1.connection,
    concurrency: 5
});
//# sourceMappingURL=generate_reference_embeddings.worker.js.map