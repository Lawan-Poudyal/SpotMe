import { useQuery , useMutation , useQueryClient } from "@tanstack/react-query"; 
import type { Dispatch , SetStateAction } from "react";
import { 
addEvent,
updateEvent,
getEvent,
deleteEvent
} from "../api/eventApi";
import { ApiError } from "../error/requestPayloadError";
import type { eventType } from "../types/eventType";
import { handleNonUniqueEventNames } from "../utility/eventUtils";

export function useEvents(userId : string){

    return useQuery<eventType[]>({
	queryKey : ["events"],
	queryFn :  ()=> getEvent(userId) as Promise<eventType[]>,
	enabled : !!userId,
	staleTime : 1000 * 60 * 5,
	refetchOnWindowFocus: true
    })

}

export function useUpdateEvent(currentName : string ,eventId : string,events : eventType[], userId : string ,  setIsLoading : Dispatch<SetStateAction<boolean>> , setTitleError : Dispatch<SetStateAction<string>> , setSubTitleError  :Dispatch<SetStateAction<string>> , setIsErrorOpen : Dispatch<SetStateAction<boolean>>){

    const queryClient = useQueryClient()

    return useMutation({
	mutationFn : (eventName : string)=>updateEvent(eventName , userId , currentName , setIsLoading),
	onSuccess: (response : eventType)=>{
	    const newEvents = events.map(item =>{
		if (item.id !== eventId ) return item;
		else return {...item , eventName : response.eventName }
	    })
	    queryClient.setQueryData(["events"] , newEvents)
	},	
	onError : (err : unknown)=>{
	    if (err instanceof ApiError){
		setTitleError(err.payload?.name as string)
		setSubTitleError(err.payload?.message as string)
		setIsErrorOpen(true)
	    }
	}
    })
    
}
export function useCreateEvent(eventName : string,events : eventType[], userId : string , setIsLoading : Dispatch<SetStateAction<boolean>> , setTitleError : Dispatch<SetStateAction<string>> , setSubTitleError  :Dispatch<SetStateAction<string>> , setIsErrorOpen : Dispatch<SetStateAction<boolean>>){

    const queryClient = useQueryClient()

    return useMutation({
	mutationFn : ()=>addEvent(eventName , userId , setIsLoading),
	onSuccess: (newEventsList : eventType[])=>{
	    queryClient.setQueryData(['events'] , [...events, newEventsList])
	},	
	onError : (err : unknown)=>{
	    if (err instanceof ApiError){
		setTitleError(err.payload?.name as string)
		setSubTitleError(err.payload?.message as string)
		setIsErrorOpen(true)
	    }
	}
    })
    
}


export function useDeleteEvent(eventName : string , userId : string , setIsLoading : Dispatch<SetStateAction<boolean>> , setTitleError : Dispatch<SetStateAction<string>> , setSubTitleError  :Dispatch<SetStateAction<string>> , setIsErrorOpen : Dispatch<SetStateAction<boolean>>){

    const queryClient = useQueryClient()

    return useMutation({
	mutationFn : ()=>deleteEvent(eventName , userId , setIsLoading),
	onSuccess: ()=>{
	    queryClient.invalidateQueries({queryKey : ['events']})
	},	
	onError : (err : unknown)=>{
	    if (err instanceof ApiError){
		setTitleError(err.payload?.name as string)
		setSubTitleError(err.payload?.message as string)
		setIsErrorOpen(true)
	    }
	}
    })
    
}
