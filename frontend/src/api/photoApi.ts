import { api } from '../config/axios';
import type { Photo } from '../types/photoType';

export const photo = {
  getPhotos: async (eventId: string): Promise<Photo[]> => {
    const res = await api.get(`/api/photos?eventid=${eventId}`);
    return res.data.data;
  },
};
