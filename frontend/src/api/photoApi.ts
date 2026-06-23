import { api } from '../config/axios';
import type { Photo } from '../types/photoType';

export const photo = {
  getPhotos: async (eventId: string): Promise<Photo[]> => {
    const res = await api.get(`/api/photos?eventid=${eventId}`);
    return res.data.data;
  },

  deletePhoto: async (photoId: string, eventId: string) => {
    const res = await api.delete(`/api/photos/delete?photoid=${photoId}&eventid=${eventId}`);
    return res.data.success;
  },
};
