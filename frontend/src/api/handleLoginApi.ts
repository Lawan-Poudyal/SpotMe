// this will handle the login api ofcourse


import type {Dispatch , SetStateAction} from 'react'
import type { loginApiType } from "../types/loginApiType"

const userMockData = [
    {email : "abhiyanregmi@gmail.com" , password:"1111111!"},
    {email : "sarthakregmi@gmail.com" , password:"1111111!"}
]

export const handleLoginApi = (email : string , password : string , setIsLoading : Dispatch<SetStateAction<boolean>>)=>{

    let exists : boolean = false 

    setIsLoading(true)
    
    userMockData.forEach((item)=>{
	if (email === item.email && item.password === password){
	    exists = true
	}
    })

    if(exists){
	const loginSuccessPayload : loginApiType = {
	    success : true
	}

	setTimeout(()=>{
	    setIsLoading(false)
	} , 500)
	return loginSuccessPayload
    }
    else{
	const loginFailurePayload : loginApiType = {
	    success : false,
	    error : {
		errMsg : "Wrong password or username"
	    }
	}
	setTimeout(()=>{
	    setIsLoading(false)
	} , 500)
	return loginFailurePayload
    }


}
