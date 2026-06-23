import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../config/prismaClientConfig";
import dbErrorHash from "../utils/dbErrorHash";
import { cloudinary } from "../lib/cloudinary";
import axios from 'axios'
import type { requestPayloadMultiple } from "../types/photo.types";
import type { dbErrorType } from "../utils/dbErrorHash";
import type {Request, Response} from 'express' 

type toInjectType = {
    secure_url : string;
    public_id : string;
    height : string;
    width : string;
}

const createPhotoHandler = async(req : Request , res : Response)=>{
    try {

	let {eventId , ownerId , accessToken , driveFileIds} = req.body as requestPayloadMultiple
	
	if(!eventId || eventId.trim()===""){
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing event id in the request payload'
		}
	    })
	}
	if(!ownerId || ownerId.trim()=== "") {
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing owner id in the request payload'
		}
	    })
	}
	if(!accessToken || accessToken.trim()=== "") {
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing access token in request payload'
		}
	    })
	}


	const googleDriveResponse = await Promise.all(
	    driveFileIds.map(async (id) =>{
		const response =  await axios.get(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
			  {
		    responseType : 'arraybuffer',
		    headers : {
			Authorization : `Bearer ${accessToken}`,
		    }
		})	
		const uploadResult = await new Promise((resolve, reject) => {
		    cloudinary.uploader.upload_chunked_stream({ resource_type: "image", chunk_size: 5000000}, (error, uploadResult) => {
			if (error) {
			    return reject(error);
			}
			return resolve(uploadResult);
		}).end(response.data);
		});
		
	    return uploadResult
	    })
	) as toInjectType[]

	const toInjectOnce = googleDriveResponse.map(item => {
	    return { uploaded_by : ownerId , event_id : eventId , photo_url : item.secure_url ,public_id:item.public_id , height : item.height , width: item.width }
	}) 

	try{
	    await prisma.photo.createMany({
		data : toInjectOnce
	    })
	}
	catch(dbError : unknown){
	    if(dbError instanceof PrismaClientKnownRequestError){
		const dbErrorCode = dbError.code
		const dbErrorName : dbErrorType = dbErrorHash[dbErrorCode] as dbErrorType 
		if(dbErrorName === "ForeignKeyConstraintViolation"){
		    return res.status(401).json({
			success : false,
			err : {
			    name : "Owner or Event doesn't exist",
			    message : "The account or the event has been either deleted by the user or as per community guideline"
			}
		    })

		}
		else if(dbErrorName === "UniqueConstraintViolation"){
		    return res.status(409).json({
			success : false,
			err : {
			    name : "Conflicting names exist",
			    message : "Try using a different name which doesn't already exist in your events"
			}
		    })
		}
		else throw dbError
	    }
	else throw dbError
	}

	return res.status(200).json({
	    success :true,
	    data : {success : true}
	})
	

    }
    catch(err : unknown){
	if(err instanceof Error){
	    return res.status(500).json({
		success : false,
		err :{
		    name : err.name,
		    message : err.message
		}
	    })
	}

    }
} 

export {createPhotoHandler}
