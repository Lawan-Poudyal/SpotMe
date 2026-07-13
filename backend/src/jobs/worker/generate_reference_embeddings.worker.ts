import { Worker } from "bullmq";
import {connection} from "../../config/redis"
import { generatedEmbedding} from "../processor/generate_reference_embeddings.processor";

export const referenceEmbeddingWorker = new Worker(
    "generate-reference-embeddings",
    generatedEmbedding,
    {
	connection : connection,
	concurrency : 5
    }
)

