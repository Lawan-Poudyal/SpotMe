import {Queue} from 'bullmq'
import {connection} from '../config/redis'

export const referenceEmbeddingQueue = new Queue('generate-reference-embeddings' , {
    connection : connection,
    defaultJobOptions : {
	attempts : 1,
	removeOnComplete : true,
	removeOnFail : true
    }
})




