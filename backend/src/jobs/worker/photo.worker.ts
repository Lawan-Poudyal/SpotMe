import { Worker } from "bullmq";
import {connection} from "../../config/redis"
import { processPhotoJob } from "../processor/photo.processor";

export const photoWorker = new Worker(
    "photo-processing",
    processPhotoJob,
    {
	connection : connection,
	concurrency : 5
    }
)

