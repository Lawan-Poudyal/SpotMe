import {Queue} from 'bullmq'
import {connection} from '../config/redis'

export const referencePhotoQueue = new Queue('reference-photo-processing' , {
    connection : connection,
    defaultJobOptions : {
	attempts : 1,
	removeOnComplete : true,
	removeOnFail : true
    }
})




