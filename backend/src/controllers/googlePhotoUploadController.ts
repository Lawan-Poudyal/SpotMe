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
	    return { uploaded_by : ownerId , event_id : eventId , photo_url :  item }
	})

	try{
	    const data = await prisma.photo.create({
		data : {
		    userId : ownerId,
		    eventName  : eventName
		}
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
			    name : "Owner doesn't exist",
			    message : "The account has been either deleted by the user or as per community guideline"
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
	    data : {...event, numberOfImages : 0}
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
const getEventHandler = async(req : Request , res : Response)=>{
    try {

	let {ownerId} = req.query as getRequestPaylaodType
	if(!ownerId || ownerId.trim()=== "") {
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing owner id in the request payload'
		}
	    })
	}

	let events : eventType[] = []
	try{
	    events = await prisma.event.findMany({
		where : {
		    userId : ownerId
		},
		select : {
		    id : true,
		    userId : true,
		    eventName : true,
		    createdAt : true,
		    updatedAt : true
		}
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
			    name : "Owner doesn't exist",
			    message : "The account has been either deleted by the user or as per community guideline"
			}
		    })

		}
		else throw dbError
	    }
	else throw dbError
	}

	return res.status(200).json({
	    success :true,
	    data : events 
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
const updateEventHandler = async(req : Request , res : Response)=>{
    try {

	let {ownerId , eventName , currentName} = req.body as updateRequestPayloadType
	if(!ownerId || ownerId.trim()=== "") { // although !ownerId is enough for === "" and !ownerId both but did it to show what i intended.
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing owner id in the request payload'
		}
	    })
	}
	if(!eventName || eventName.trim()=== "") {
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing event name in the request payload'
		}
	    })
	}
	if(!currentName || currentName.trim()=== "") {
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing current Name in the request payload'
		}
	    })
	}


	try{
	 const data = await prisma.event.update({
		where : {
		    eventName_userId : {
			userId : ownerId,
			eventName : currentName
		    }
		},
		data : {
		    eventName : eventName
		}
	    })

	return res.status(200).json({
	    success : true,
	    data : data
	})

	}
	catch(dbError : unknown){
	    if(dbError instanceof PrismaClientKnownRequestError){
		const dbErrorCode = dbError.code
		const dbErrorName : dbErrorType = dbErrorHash[dbErrorCode] as dbErrorType 
		if(dbErrorName === "CompositeKeyViolation"){ 
		    return res.status(404).json({
			success : false,
			err : {
			    name : `Couldn't find ${eventName}`,
			    message : `You have never created a event named ${eventName}`
			}
		    })

		}
		else throw dbError
	    }
	else throw dbError
	}

	

    }
    catch(err : unknown){
	if(err instanceof Error){
	    console.log(err.name)
	    console.log(err.stack)
	    console.log(err.message)
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
const deleteEventHandler = async(req : Request , res : Response)=>{
    try {

	let {ownerId , eventName} = req.body as deleteRequestPayloadType
	if(!ownerId || ownerId.trim()=== "") { // although !ownerId is enough for === "" and !ownerId both but did it to show what i intended.
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing owner id in the request payload'
		}
	    })
	}
	if(!eventName || eventName.trim()=== "") {
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing event name in the request payload'
		}
	    })
	}

	try{
	 await prisma.event.delete({
		where : {
		    eventName_userId : {
			userId : ownerId,
			eventName : eventName
		    }
		}
	    })

	return res.status(200).json({
	    success : true
	})

	}
	catch(dbError : unknown){
	    if(dbError instanceof PrismaClientKnownRequestError){
		const dbErrorCode = dbError.code
		const dbErrorName : dbErrorType = dbErrorHash[dbErrorCode] as dbErrorType 
		if(dbErrorName === "CompositeKeyViolation"){ 
		    return res.status(404).json({
			success : false,
			err : {
			    name : `Couldn't find ${eventName}`,
			    message : `You have never created a event named ${eventName}`
			}
		    })

		}
		else throw dbError
	    }
	else throw dbError
	}

	

    }
    catch(err : unknown){
	if(err instanceof Error){
	    console.log(err.name)
	    console.log(err.stack)
	    console.log(err.message)
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

export {createEventHandler, getEventHandler, updateEventHandler , deleteEventHandler}
