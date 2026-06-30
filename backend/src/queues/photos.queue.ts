import {Queue} from 'bullmq'
import {connection} from '../config/redis'

export const photoQueue = new Queue('photo-processing' , {
    connection : connection,
    defaultJobOptions : {
	attempts : 1,
	removeOnComplete : true,
	removeOnFail : true
    }
})



