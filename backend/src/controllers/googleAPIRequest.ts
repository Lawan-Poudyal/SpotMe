import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../config/prismaClientConfig";
import type {Request , Response} from "express"
import dbErrorHash from "../utils/dbErrorHash";
import type { dbErrorType } from "../utils/dbErrorHash";

type getRequestPaylaodType = {
    ownerId : string;
}

type requestBodyType = {
    id : string;
    providerId : string;
    accessToken : string | null;
    refreshToken : string | null;
    idToken : string | null;
    accessTokenExpiresAt : Date | null;
}

const getAPIKeyHandler = async(req : Request , res : Response)=>{
    try {

	let {ownerId} = req.query as getRequestPaylaodType
	console.log(ownerId)
	if(!ownerId || ownerId.trim()=== "") {
	    return res.status(400).json({
		success : false,
		err : {
		    name : 'Bad request payload',
		    message : 'Missing owner id in the request payload'
		}
	    })
	}

	let requestBody : requestBodyType | null = null

	try{
	    requestBody = await prisma.account.findFirst({
		where : {
		    userId : ownerId,
		    providerId : 'google'
		},
		select:{
		    id : true,
		    providerId : true,
		    accessToken : true,
		    refreshToken  :true,
		    idToken : true,
		    accessTokenExpiresAt: true
		}
	    }) 

	    if (!requestBody || !requestBody.idToken){
		return res.status(403).json({
		    success : false,
		    data : {
			cause : 'access_denied' // because the user might have missing providerId google 	
		    }}
		)
	    }

	    // checking for access Token expiration
	    
	    const expirationTimeSeconds = Math.floor(new Date(String(requestBody.accessTokenExpiresAt)).getTime() / 1000) 

	    if (Date.now() > expirationTimeSeconds){

	    }

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
	    data : {mogged : 'you just go mogged' , body : requestBody}
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

export {getAPIKeyHandler}
