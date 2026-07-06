// This is my schema one 

import { z } from 'zod';

// The full shape — single source of truth for the Event resource
export const eventBaseSchema = z.object({
  eventName: z
    .string({ required_error: 'Missing event name in the request payload' })
    .trim()
    .min(1, 'Missing event name in the request payload'),
  ownerId: z
    .string({ required_error: 'Missing owner id in the request payload' })
    .trim()
    .min(1, 'Missing owner id in the request payload'),
  thumbNailId: z
    .string({ required_error: 'Missing location in the request payload' })
    .trim()
    .min(1, 'Missing location in the request payload'),
  eventId: z
    .string({ required_error: 'Missing eventId in the request payoad' })
    .trim()
    .min(1, 'Missing eventId in the request payoad'),
});

export const createEventSchema = eventBaseSchema.pick({
  eventName: true,
  ownerId: true
});

export const getEventSchema = eventBaseSchema.pick({
  ownerId: true,
});

export const deleteEventSchema = eventBaseSchema.pick({
  ownerId: true,
  eventName: true,
  eventId: true
});


export const getParticipantsSchema = eventBaseSchema.pick({
  eventId: true,
  ownerId: true,
});

export type GetParticipantsPayload = z.infer<typeof getParticipantsSchema>;
export type CreateEventPayload = z.infer<typeof createEventSchema>;
export type GetEventPayload = z.infer<typeof getEventSchema>;
export type DeleteEventPayload = z.infer<typeof deleteEventSchema>;
