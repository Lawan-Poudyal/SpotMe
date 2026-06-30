import { api } from '../config/axios';
import type { InviteLinkType } from '../types/inviteLinkType';

export const inviteLink = {
  generate: async (eventId: string): Promise<InviteLinkType> => {
    const res = await api.post(`/api/events/${eventId}/share`);
    return res.data.data;
  },
};
