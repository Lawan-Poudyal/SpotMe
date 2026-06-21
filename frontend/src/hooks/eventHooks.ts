import { useQuery , useMutation , useQueryClient } from "@tanstack/react-query"; 
import type { Dispatch , SetStateAction } from "react";
import { 
addEvent,
updateEvent,
getEvent,
deleteEvent
} from "../api/eventApi";
import { ApiError } from "../error/requestPayloadError";

export function useEvents(userId : string){

    return useQuery({
	queryKey : ["events"],
	queryFn :  ()=> getEvent(userId),
	enabled : !!userId,
	staleTime : 1000 * 60 * 5,
	refetchOnWindowFocus: true
    })

}

export function useUpdateEvent(eventName : string , userId : string , currentName : string , setIsLoading : Dispatch<SetStateAction<boolean>> , setTitleError : Dispatch<SetStateAction<string>> , setSubTitleError  :Dispatch<SetStateAction<string>> , setIsErrorOpen : Dispatch<SetStateAction<boolean>>){

    const queryClient = useQueryClient()

    return useMutation({
	mutationFn : ()=>updateEvent(eventName , userId , currentName , setIsLoading),
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
export function useCreateEvent(eventName : string , userId : string , setIsLoading : Dispatch<SetStateAction<boolean>> , setTitleError : Dispatch<SetStateAction<string>> , setSubTitleError  :Dispatch<SetStateAction<string>> , setIsErrorOpen : Dispatch<SetStateAction<boolean>>){

    const queryClient = useQueryClient()

    return useMutation({
	mutationFn : ()=>addEvent(eventName , userId , setIsLoading),
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
