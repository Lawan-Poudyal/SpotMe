import type { Dispatch, SetStateAction } from 'react';
import { api } from '../config/axios';
import axios from 'axios';

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
    return { success: true, ...response.data.data };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return { success: false, ...err.response?.data };
    }
  } finally {
    setIsLoading(false);
  }
};
const updateEvent = async (
  eventName: string,
  userId: string,
  currentName: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const response = await api.put('/api/event', {
      eventName: eventName,
      ownerId: userId,
      currentName: currentName,
    });
    return { success: true, ...response.data.data };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return { success: false, ...err.response?.data };
    }
  } finally {
    setIsLoading(false);
  }
};
const deleteEvent = async (
  eventName: string,
  userId: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    await api.delete('/api/event', {
      data: {
        eventName: eventName,
        ownerId: userId,
      },
    });
    return { success: true };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return { success: false };
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
    return { success: true, data: response.data.data };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return { success: false, ...err.response?.data };
    }
  }
};

export { addEvent, getEvent, updateEvent, deleteEvent };
