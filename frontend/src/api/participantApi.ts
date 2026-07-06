import { api } from './../config/axios'; // adjust to whatever your other api files import

export interface Participant {
    name: string;
    userName: string | null;
    profilePic: string | null;
}

interface ParticipantsResponse {
    success: boolean;
    count: number;
    participants: Participant[];
}

export const participantApi = {
    getParticipants: async (eventId: string, ownerId: string): Promise<ParticipantsResponse> => {
        const { data } = await api.get(`/api/participants/${eventId}/${ownerId}`);
        return data;
    },
};