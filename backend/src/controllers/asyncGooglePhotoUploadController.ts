import type { requestPayloadMultiple } from "../types/photo.types";
import {photoQueue} from '../queues/photos.queue'
import type {Request, Response} from 'express' 
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

	await Promise.all(
	    driveFileIds.map(async(driveFileId) =>{
		await photoQueue.add("process-photo",{
		    eventId : eventId,
		    ownerId : ownerId,
		    accessToken : accessToken,
		    driveFileId : driveFileId
		}
	    )
	    })
	)
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

