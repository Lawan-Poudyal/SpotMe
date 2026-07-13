import { Worker } from "bullmq";
import {connection} from "../../config/redis"
import { generatedEmbedding} from "../processor/generate_embeddings.processor";

export const photoWorker = new Worker(
    "generate-embeddings",
    generatedEmbedding,
    {
	connection : connection,
	concurrency : 5
    }
)

