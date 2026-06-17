import axios from 'axios';
import type { Dispatch, SetStateAction } from 'react';

const generateSignRequest = async (
  eventName: string,
  userId: string,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/api/sign-upload`, {
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
