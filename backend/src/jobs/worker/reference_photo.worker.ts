import { Worker } from "bullmq";
import {connection} from "../../config/redis"
import { processPhotoJob } from "../processor/reference_photo.processor";

export const photoWorker = new Worker(
    "reference-photo-processing",
    processPhotoJob,
    {
	connection : connection,
	concurrency : 5
    }
)

