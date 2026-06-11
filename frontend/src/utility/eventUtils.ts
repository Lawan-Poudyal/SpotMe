import type { eventType } from "../types/eventType"
import type { Dispatch , SetStateAction } from "react"
import { addEvent , getEvent, updateEvent} from "../api/eventApi"

type errType = {
    name : string;
    message : string;
}


const handleNonUniqueEventNames =(eventName : string , events : eventType[] , setTitleError : Dispatch<SetStateAction<string>> , setSubTitleError : Dispatch<SetStateAction<string>> , setIsErrorOpen : Dispatch<SetStateAction<boolean>>)=>{
    // if true returned no conflict, if false return confilct
    const exists = events.find(item => item.eventName === eventName) 
    if(exists){
	setIsErrorOpen(true) 
	setTitleError("Same events already exists")
	setSubTitleError("Try a different name please")
	return false
    }
    return true
}
export const onAddEvent = async (eventName :string, events : eventType[] , setTitleError : Dispatch<SetStateAction<string>> , setSubTitleError : Dispatch<SetStateAction<string>> , setIsErrorOpen : Dispatch<SetStateAction<boolean>> ,setEvents : Dispatch<SetStateAction<eventType[]>> , setIsLoading : Dispatch<SetStateAction<boolean>>, userId : string)=>{
    const conflictExists = handleNonUniqueEventNames(eventName , events , setTitleError , setSubTitleError, setIsErrorOpen )	
    if(!conflictExists) return 

    const data = await addEvent(eventName , userId , setIsLoading) as eventType & {success : boolean , err : errType}


    if(!data.success){
	setTitleError(data.err.name)
	setSubTitleError(data.err.message)
	setIsErrorOpen(true)
	return
    }

    const newEvent : eventType = {
	id : data.id,
	userId : data.userId,
	eventName : data.eventName,
	numberOfImages : data.numberOfImages,
	createdAt : data.createdAt,
	updatedAt : data.updatedAt
    }
    setEvents([...events,  newEvent])
}
export const onUpdateEvent = async (currentName : string , eventName : string ,eventId :string, events : eventType[] , setTitleError : Dispatch<SetStateAction<string>> , setSubTitleError : Dispatch<SetStateAction<string>> , setIsErrorOpen : Dispatch<SetStateAction<boolean>> ,setEvents : Dispatch<SetStateAction<eventType[]>> , setIsLoading : Dispatch<SetStateAction<boolean>>, userId : string)=>{
    const conflictExists = handleNonUniqueEventNames(eventName , events , setTitleError , setSubTitleError, setIsErrorOpen )	
    if(!conflictExists) return 

   const data = await updateEvent(eventName ,userId , currentName , setIsLoading) as eventType & {success : boolean , err : errType}
    if(!data.success){
	setTitleError(data.err.name)
	setSubTitleError(data.err.message)
	setIsErrorOpen(true)
	return
    }
    setEvents(events.map(event => {
	if (event.id !== eventId) return event
	else return {...event , eventName : eventName}	
    }))
}

export const onGetEvent = async ( setTitleError : Dispatch<SetStateAction<string>> , setSubTitleError : Dispatch<SetStateAction<string>> , setIsErrorOpen : Dispatch<SetStateAction<boolean>> ,setEvents : Dispatch<SetStateAction<eventType[]>> , userId : string)=>{

    const data = await getEvent(userId) as  {data : eventType[],success : boolean , err : errType} 



    if(!data.success){
	setTitleError(data.err.name)
	setSubTitleError(data.err.message)
	setIsErrorOpen(true)
	return
    }

    setEvents(data.data)
}
