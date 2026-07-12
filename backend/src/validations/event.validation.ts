import { z } from 'zod';

export const updateEventSchema = z.object({
  eventId: z.string().trim().uuid('Invalid eventId format'),
  eventName: z.string().trim().min(1, 'Invalid eventName format').optional(),
  thumbNailId: z.string().trim().uuid('Invalid thumbNailId format').optional(),
});

export type UpdateRequestPayload = z.infer<typeof updateEventSchema>;
