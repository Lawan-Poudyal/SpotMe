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
  thumbnailId: string;
  photo_url: string;
  width: number | null;
  height: number | null;
};

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
    mutationFn: (eventName: string) => updateEvent(eventName, eventId, undefined, setIsLoading),
    onMutate: async (eventName: string) => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      const previous = queryClient.getQueryData<eventType[]>(['events']);

      queryClient.setQueryData<eventType[]>(['events'], (old) =>
        old
          ? old.map((item) => {
              if (item.id !== eventId) return item;
              return { ...item, eventName: eventName };
            })
          : [],
      );

      return { previous };
    },
    onError: (err: unknown, eventName: string, context) => {
      if (err instanceof ApiError) {
        setTitleError(err.payload?.name as string);
        setSubTitleError(err.payload?.message as string);
        setIsErrorOpen(true);
      }
      if (context?.previous) {
        queryClient.setQueryData(['events'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
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
    mutationFn: ({ thumbnailId, photo_url, width, height }: updateThumbnailType) =>
      updateEvent(currentName, eventId, thumbnailId, setIsLoading),
    onMutate: async ({ thumbnailId, photo_url, width, height }: updateThumbnailType) => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      const previous = queryClient.getQueryData<eventType[]>(['events']);

      queryClient.setQueryData<eventType[]>(['events'], (old) =>
        old
          ? old.map((item) => {
              if (item.id !== eventId) return item;
              return {
                ...item,
                thumbnail: {
                  id: thumbnailId,
                  photo_url: photo_url,
                  width: width,
                  height: height,
                },
              };
            })
          : [],
      );
      return { previous };
    },
    onError: (err: unknown, _variables: updateThumbnailType, context) => {
      if (err instanceof ApiError) {
        setTitleError(err.payload?.name as string);
        setSubTitleError(err.payload?.message as string);
        setIsErrorOpen(true);
      }
      if (context?.previous) {
        queryClient.setQueryData(['events'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
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

  return useMutation<eventType | undefined, unknown, void, { previous?: eventType[] }>({
    mutationFn: () => addEvent(eventName, userId, setIsLoading),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      const previous = queryClient.getQueryData<eventType[]>(['events']);

      const tempId = `temp-${Date.now()}`;
      const optimisticEvent: eventType = {
        id: tempId,
        eventName: eventName,
        userId: userId,
        thumbnail: null,
        photoCount: 0,
      };

      queryClient.setQueryData<eventType[]>(['events'], (old) => {
        const currentList = old || events;
        return [...currentList, optimisticEvent];
      });

      return { previous };
    },

    onSuccess: (newAddedEvent: eventType | undefined) => {
      if (!newAddedEvent) {
        queryClient.setQueryData<eventType[]>(['events'], (old) =>
          (old || []).filter((item) => !item.id.toString().startsWith('temp-')),
        );
        return;
      }

      queryClient.setQueryData<eventType[]>(['events'], (old) => {
        const currentList = (old || []).filter((item) => !item.id.toString().startsWith('temp-'));
        return [...currentList, newAddedEvent];
      });
    },

    onError: (err: unknown, _variables: void, context) => {
      if (err instanceof ApiError) {
        setTitleError(err.payload?.name as string);
        setSubTitleError(err.payload?.message as string);
        setIsErrorOpen(true);
      }

      if (context?.previous) {
        queryClient.setQueryData(['events'], context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent(
  eventName: string,
  events: eventType[],
  userId: string,
  eventId: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setTitleError: Dispatch<SetStateAction<string>>,
  setSubTitleError: Dispatch<SetStateAction<string>>,
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteEvent(eventName, userId, eventId, setIsLoading),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['events'] });
      const previous = queryClient.getQueryData<eventType[]>(['events']);

      // Filter out deleted event using either ID (preferred) or name
      queryClient.setQueryData<eventType[]>(['events'], (old) =>
        old ? old.filter((item) => item.id !== eventId && item.eventName !== eventName) : [],
      );

      return { previous };
    },
    onError: (err: unknown, _variables: void, context) => {
      if (err instanceof ApiError) {
        setTitleError(err.payload?.name as string);
        setSubTitleError(err.payload?.message as string);
        setIsErrorOpen(true);
      }
      if (context?.previous) {
        queryClient.setQueryData(['events'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
