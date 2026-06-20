import type {Request , Response} from "express"
import { auth } from "../config/auth";
import { APIError } from "better-auth";

type getRequestPaylaodType = {
    ownerId : string;
}
type requestBodyType = {
    accessToken : string | null;
    accessTokenExpiresAt : Date | undefined;
    scopes : string[];
    idToken : string | undefined; 
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
		    msg : 'Missing owner id in the request payload'
		}
	    })
	}

	let requestBody : requestBodyType | null = null

	try{
	    requestBody = await auth.api.getAccessToken({
		body:{
		    providerId : 'google',
		    userId : ownerId
		}
	    }) 

	    if(!requestBody.scopes.includes('https://www.googleapis.com/auth/drive.file')){
		return res.status(403).json({
		    success : false,
		    err: {
			name : 'Unauthorized',
			msg :"unauthorized_for_google_drive_api" 
		    }
		})
	    }

	}

	catch(dbError){
	    if(dbError instanceof APIError){
		return res.status(404).json(
		    {
			success : false,
			err : {
			    name : 'Not Found',
			    msg : "The account isn't found "
			}
		    }
		)
	    }
	}

	return res.status(200).json({
	    success :true,
	    data : {success : true , data : requestBody}
	})
	

    }
    catch(err : unknown){
	if(err instanceof Error){
	    console.log()
	    console.log(err.stack)
	    return res.status(500).json({
		success : false,
		err :{
		    name : err.name,
		    msg : err.message
		}
	    })
	}

    }
} 

export {getAPIKeyHandler}
