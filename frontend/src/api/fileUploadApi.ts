import axios from 'axios';
import { api } from '../config/axios';
import type { UploadSignatureResponse } from '../types/uploadSignatureTypes';

export const fileUploads = {
  signRequest: async (eventId: string): Promise<UploadSignatureResponse> => {
    const res = await api.post(`/api/upload/photo/sign?eventId=${eventId}`);
    return res.data.data;
  },

  uploadFile: async (formToUpload: FormData, cloudName: string) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const res = await axios.post(url, formToUpload);
    return res.data;
  },

  saveUpload: async (
    eventId: string,
    photos: { url: string; publicId: string; height: number; width: number }[],
  ) => {
    const res = await api.post(`/api/upload/photo/save?eventId=${eventId}`, { photos });
    return res.data;
  },
};
