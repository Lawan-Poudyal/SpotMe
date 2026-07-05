import type { Dispatch, SetStateAction } from 'react';
import { api } from '../config/axios';
import axios from 'axios';
import { ApiError } from '../error/requestPayloadError';
import type { eventType } from '../types/eventType';

const addEvent = async (
  eventName: string,
  userId: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const response = await api.post('/api/event', {
      eventName: eventName,
      ownerId: userId,
    });
    return response.data.data as eventType;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new ApiError('Failed', {
        payload: {
          success: false,
          name: err.response?.data.err?.name,
          message: err.response?.data.err?.message,
        },
      });
    }
  } finally {
    setIsLoading(false);
  }
};

const updateEvent = async (
  eventName: string,
  eventId: string,
  thumbNailId: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const response = await api.put('/api/event', {
      eventName,
      eventId,
      thumbNailId,
    });
    return response.data.data as eventType;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new ApiError('Failed', {
        payload: {
          success: false,
          name: err.response?.data.err?.name,
          message: err.response?.data.err?.message,
        },
      });
    }
  } finally {
    setIsLoading(false);
  }
};

const deleteEvent = async (
  eventName: string,
  userId: string,
  eventId : string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    await api.delete('/api/event', {
      data: {
        eventName: eventName,
        ownerId: userId,
	eventId : eventId
      },
    });
    return { success: true };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new ApiError('Failed', {
        payload: {
          success: false,
          name: null,
          message: null,
        },
      });
    }
  } finally {
    setIsLoading(false);
  }
};
const getEvent = async (userId: string) => {
  try {
    const response = await api.get('/api/event', {
      params: {
        ownerId: userId,
      },
    });
    return response.data.data as eventType[];
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new ApiError('Failed', {
        payload: {
          success: false,
          name: err.response?.data.err?.name,
          message: err.response?.data.err?.message,
        },
      });
    }
    throw err;
  }
};

const getEventById = async (eventId: string) => {
  try {
    const response = await api.get(`/api/event/${eventId}`);
    return response.data.data as eventType[];
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      throw new ApiError('Failed', {
        payload: {
          success: false,
          name: err.response?.data.err?.name,
          message: err.response?.data.err?.message,
        },
      });
    }
    throw err;
  }
};

export { addEvent, getEvent, updateEvent, deleteEvent, getEventById };
