import { api } from '../config/axios';
import type { Photo } from '../types/photoType';

export const photo = {
  getPhotos: async (eventId: string): Promise<Photo[]> => {
    const res = await api.get(`/api/event/photo?eventId=${eventId}`);
    return res.data.data;
  },

  deletePhoto: async (photoId: string, eventId: string) => {
    const res = await api.delete(`/api/event/photo/delete?photoId=${photoId}&eventId=${eventId}`);
    return res.data.success;
  },

  getReferencePhoto : async(eventId : string , userId : string)=>{
      const res =await api.get(`/api/event/photo/single?eventId=${eventId}&userId=${userId}`)
      return res.data.data ?? null;
  }

};
