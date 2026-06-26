import { z } from 'zod';

export const updateEventSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
  eventName: z.string().min(1, 'eventName cannot be empty').optional(),
  thumbNailId: z.string().min(1, 'thumbNailId cannot be empty').optional(),
});

export type UpdateRequestPayload = z.infer<typeof updateEventSchema>;
