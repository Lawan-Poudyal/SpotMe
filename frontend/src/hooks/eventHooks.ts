import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Dispatch, SetStateAction } from 'react';
import { addEvent, updateEvent, getEvent, deleteEvent } from '../api/eventApi';
import { ApiError } from '../error/requestPayloadError';
import type { eventType } from '../types/eventType';
export function useEvents(userId: string) {
  return useQuery<eventType[]>({
    queryKey: ['events'],
    queryFn: () => getEvent(userId) as Promise<eventType[]>,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}

type updateThumbnailType = {
    thumbnailId : string;
    photo_url : string;
    width : number | null;
    height : number | null ;
}

export function useUpdateEvent(
  currentName: string,
  eventId: string,
  events: eventType[],
  userId: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setTitleError: Dispatch<SetStateAction<string>>,
  setSubTitleError: Dispatch<SetStateAction<string>>,
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventName: string) => updateEvent(eventName, eventId, undefined , setIsLoading),
    onMutate : async(eventName : string)=>{
	await queryClient.cancelQueries({queryKey : ['events']})
	const previous = queryClient.getQueryData(['events'])
	
	queryClient.setQueryData(['events'] , (old :eventType[])=>
	    old ? old.map((item)=> {
		if (item.id !== eventId) return item;
		else{
		    return {...item , eventName :eventName }
		}
	    }) : []
	)

	return {previous}
    },
    onError: (err: unknown , eventName : string , context) => {
      if (err instanceof ApiError) {
        setTitleError(err.payload?.name as string);
        setSubTitleError(err.payload?.message as string);
        setIsErrorOpen(true);
      }
      queryClient.setQueryData(['events'] , context?.previous)
    },
    onSettled: () => {
	queryClient.invalidateQueries({queryKey : ['events']})
    },
  });
}

export function useUpdateThumbnail(
  currentName: string,
  eventId: string,
  events: eventType[],
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setTitleError: Dispatch<SetStateAction<string>>,
  setSubTitleError: Dispatch<SetStateAction<string>>,
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({thumbnailId , photo_url , width , height} : updateThumbnailType) => updateEvent(currentName, eventId, thumbnailId , setIsLoading),
    onMutate : async({thumbnailId , photo_url , width , height} : updateThumbnailType) =>{
	await queryClient.cancelQueries({queryKey : ['events']})
	const previous = queryClient.getQueryData(['events'])

	queryClient.setQueryData(['events'], (old : eventType[])=>
	    old ? old.map(item =>{ 
		if (item.id !== eventId) return item;
		else{
		    return {...item , thumbnail : {id : thumbnailId , photo_url : photo_url , width : width , height : height}}
		}
	    }) : []
	)
	return {previous}
    },
    onError: (err: unknown , unusable , context) => {
      if (err instanceof ApiError) {
        setTitleError(err.payload?.name as string);
        setSubTitleError(err.payload?.message as string);
        setIsErrorOpen(true);
      }
      queryClient.setQueryData(['events'] , context?.previous)
    },
    onSettled : ()=>{
	queryClient.invalidateQueries({queryKey : ['events']})
    }
  });
}
export function useCreateEvent(
  eventName: string,
  events: eventType[],
  userId: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setTitleError: Dispatch<SetStateAction<string>>,
  setSubTitleError: Dispatch<SetStateAction<string>>,
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => addEvent(eventName, userId, setIsLoading),
    onSuccess: (newEventsList: eventType[]) => {
      queryClient.setQueryData(['events'], [...events, newEventsList]);
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        setTitleError(err.payload?.name as string);
        setSubTitleError(err.payload?.message as string);
        setIsErrorOpen(true);
      }
    },
  });
}

export function useDeleteEvent(
  eventName: string,
  events: eventType[],
  userId: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setTitleError: Dispatch<SetStateAction<string>>,
  setSubTitleError: Dispatch<SetStateAction<string>>,
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteEvent(eventName, userId, setIsLoading),
    onMutate:async()=>{
	await queryClient.cancelQueries({queryKey : ['events']})
	const previous = queryClient.getQueryData(['events'])
	queryClient.setQueryData(['events'] , (old : eventType[])=>
				 old ? old.filter(item => item.eventName !== eventName) : []
				)
	return {previous}
    } ,
    onError: (err: unknown , arg : undefined  , context) => {
      if (err instanceof ApiError) {
        setTitleError(err.payload?.name as string);
        setSubTitleError(err.payload?.message as string);
        setIsErrorOpen(true);
      }
      queryClient.setQueryData(['events'] , context?.previous)
    },
    onSettled : ()=>{
	queryClient.invalidateQueries({queryKey : ['events']})
    }
  });
}
