import { api } from '../config/axios';
import type { InviteLinkType } from '../types/inviteLinkType';

export const inviteLink = {
  generate: async (eventId: string): Promise<InviteLinkType> => {
    const res = await api.post('/api/share/event', {
      eventId,
    });
    return res.data.data;
  },
};
