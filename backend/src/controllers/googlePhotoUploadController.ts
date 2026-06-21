import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../config/prismaClientConfig";
import type {Request , Response} from "express"
import dbErrorHash from "../utils/dbErrorHash";
import type { dbErrorType } from "../utils/dbErrorHash";

type requestPayload = {
    eventId : string;
    ownerId : string;
    driveFileIds : string[];
}

const createPhotoHandler = async(req : Request , res : Response)=>{
    try {

	let {eventId , ownerId , driveFileIds} = req.body as requestPayload
	console.log(eventId ,ownerId)
	console.log(driveFileIds)
	
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

	const toInjectOnce = driveFileIds.map(item => {
	    return { uploaded_by : ownerId , event_id : eventId , photo_url :  item ,public_id:`${item}-drive` , height: 200 , width: 400 }
	})

	try{
	    const data = await prisma.photo.createMany({
		data : toInjectOnce
	    })

	    console.log(data)

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
