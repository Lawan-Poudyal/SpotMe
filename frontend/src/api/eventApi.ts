import axios from 'axios'
import type { Dispatch , SetStateAction } from 'react'


const addEvent = async(eventName : string , userId : string , setIsLoading : Dispatch<SetStateAction<boolean>>)=>{
    try{

	setIsLoading(true)
	const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/event`, {
	    eventName : eventName,
	    ownerId : userId
	})
	return {success  :true  , ...response.data.data}
    }
    catch(err : unknown){
	if(axios.isAxiosError(err)){
	    return {success : false , ...err.response?.data}
	}
    }
    finally{
	setIsLoading(false)
    }
}
const updateEvent = async(eventName : string , userId : string , currentName : string, setIsLoading : Dispatch<SetStateAction<boolean>>)=>{
    try{

	setIsLoading(true)
	const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/event`, {
	    eventName : eventName,
	    ownerId : userId,
	    currentName : currentName
	})
	return {success  :true  , ...response.data.data}
    }
    catch(err : unknown){
	if(axios.isAxiosError(err)){
	    return {success : false , ...err.response?.data}
	}
    }
    finally{
	setIsLoading(false)
    }
}
const getEvent = async(userId : string)=>{
    try{

	const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/event`, {
	    params : {
		ownerId : userId
	    }
	})
	return {success  :true  , data : response.data.data}
    }
    catch(err : unknown){
	if(axios.isAxiosError(err)){
	    return {success : false , ...err.response?.data}
	}
    }
}


export {addEvent, getEvent ,updateEvent}

