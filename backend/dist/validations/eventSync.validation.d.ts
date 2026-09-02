import { z } from 'zod';
export declare const eventBaseSchema: z.ZodObject<{
    eventName: z.ZodString;
    ownerId: z.ZodString;
    thumbNailId: z.ZodString;
    eventId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    eventName: string;
    eventId: string;
    ownerId: string;
    thumbNailId: string;
}, {
    eventName: string;
    eventId: string;
    ownerId: string;
    thumbNailId: string;
}>;
export declare const createEventSchema: z.ZodObject<Pick<{
    eventName: z.ZodString;
    ownerId: z.ZodString;
    thumbNailId: z.ZodString;
    eventId: z.ZodString;
}, "eventName" | "ownerId">, "strip", z.ZodTypeAny, {
    eventName: string;
    ownerId: string;
}, {
    eventName: string;
    ownerId: string;
}>;
export declare const getEventSchema: z.ZodObject<Pick<{
    eventName: z.ZodString;
    ownerId: z.ZodString;
    thumbNailId: z.ZodString;
    eventId: z.ZodString;
}, "ownerId">, "strip", z.ZodTypeAny, {
    ownerId: string;
}, {
    ownerId: string;
}>;
export declare const deleteEventSchema: z.ZodObject<Pick<{
    eventName: z.ZodString;
    ownerId: z.ZodString;
    thumbNailId: z.ZodString;
    eventId: z.ZodString;
}, "eventName" | "eventId" | "ownerId">, "strip", z.ZodTypeAny, {
    eventName: string;
    eventId: string;
    ownerId: string;
}, {
    eventName: string;
    eventId: string;
    ownerId: string;
}>;
export declare const getParticipantsSchema: z.ZodObject<Pick<{
    eventName: z.ZodString;
    ownerId: z.ZodString;
    thumbNailId: z.ZodString;
    eventId: z.ZodString;
}, "eventId" | "ownerId">, "strip", z.ZodTypeAny, {
    eventId: string;
    ownerId: string;
}, {
    eventId: string;
    ownerId: string;
}>;
export type GetParticipantsPayload = z.infer<typeof getParticipantsSchema>;
export type CreateEventPayload = z.infer<typeof createEventSchema>;
export type GetEventPayload = z.infer<typeof getEventSchema>;
export type DeleteEventPayload = z.infer<typeof deleteEventSchema>;
//# sourceMappingURL=eventSync.validation.d.ts.map