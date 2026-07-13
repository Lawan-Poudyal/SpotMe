import {Queue} from 'bullmq'
import {connection} from '../config/redis'

export const embeddingQueue = new Queue('generate-embeddings' , {
    connection : connection,
    defaultJobOptions : {
	attempts : 1,
	removeOnComplete : true,
	removeOnFail : true
    }
})




