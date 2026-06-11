import { prisma } from "../config/prismaClientConfig"
import type {Request , Response} from 'express'

type uniqueEmailPayload = {
    email : string
}

const uniqueEmailHandler = async(req : Request , res : Response)=>{
    try{
	let {email}  = req.query as uniqueEmailPayload	
	email = email.trim()
	if (!email || email.length === 0){
	    return res.status(400).json({
		success : false,
		error : {
		    message : 'missing email in the request paylaod' 
		}
	    })
	}
	const userNameExists = await prisma.user.findUnique({
	    where : {
		email : email
	    }
	})
	if(!userNameExists) return res.status(200).json({
	    success : true // it is a success becasue we want unique Username
	})

	return res.status(409).json({
	    success : false, // because we don't want the user name exisiting
	    message : "username already exists"
	})

    }
    catch(err : unknown){
	if(err instanceof Error){
	    console.log(err.stack)
	    return res.status(500).json({
		success : false,
		error : {
		    name : err.name,
		    message : err.message
		}
	    })
	}
    }
}

export {uniqueEmailHandler}

