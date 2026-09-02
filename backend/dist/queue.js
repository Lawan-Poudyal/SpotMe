"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("./jobs/worker/reference_photo.worker");
require("./jobs/worker/photo.worker");
require("./jobs/worker/generate_embeddings.worker");
require("./jobs/worker/generate_reference_embeddings.worker");
console.log("Worker started");
//# sourceMappingURL=queue.js.map