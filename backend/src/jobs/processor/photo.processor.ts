import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import {prisma} from "../../config/prismaClientConfig"
import dbErrorHash from "../../utils/dbErrorHash";
import { Job } from "bullmq";
import { dbErrorType } from "../../utils/dbErrorHash";
import type { requestPayloadSingular } from "../../types/photo.types"; 
import axios from 'axios'
import { cloudinary } from "../..//lib/cloudinary";
import type { toInjectType } from "../../types/inject.types";

export async function processPhotoJob( job : Job<requestPayloadSingular>){
    try{
       console.log("processing")
       const {eventId , ownerId , accessToken  ,driveFileId} = job.data 

       const driveResponse = await axios.get(`https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`,
					    {
	   responseType : 'arraybuffer',
	   headers: {
	       Authorization : `Bearer ${accessToken}`
	   }
       })

	const uploadResult = await new Promise((resolve ,reject)=>{
	    cloudinary.uploader.upload_chunked_stream({resource_type : 'image', chunk_size: 5000000},
		(error, uploadResult)=>{
		    if(error){
			return reject(error)
		    }
		    return resolve(uploadResult)
		} 	
		).end(driveResponse.data)
       }) as toInjectType

	try{
	    await prisma.photo.create({
		data:{
		    uploaded_by : ownerId,
		    event_id : eventId,
		    photo_url : uploadResult.secure_url,
		    public_id : uploadResult.public_id,
		    height : Number(uploadResult.height),
		    width : Number(uploadResult.width)
		}
		    })
	}
	catch(dbError : unknown){
	    if(dbError instanceof PrismaClientKnownRequestError){
		const dbErrorCode = dbError.code
		const dbErrorName : dbErrorType = dbErrorHash[dbErrorCode] as dbErrorType 
		if(dbErrorName === "ForeignKeyConstraintViolation"){
		    console.log("The account or the event has been either deleted by the user or as per community guideline")
		}
		else if(dbErrorName === "UniqueConstraintViolation"){
		    console.log( "Try using a different name which doesn't already exist in your events")
		}
		else throw dbError
	    }
	else throw dbError
	}
	console.log(`The processing is completed for ${driveFileId}`) // don't forget to send a success webSocket call , and after the sucess webSocket call is received by the frontend for each successfull websocket transaction invalidate the query.
    }
    catch(err : unknown){
	if(err instanceof Error){
	    // in error we can return
	    console.log(err.name)
	    console.log(err.stack)
	}
    }
}
