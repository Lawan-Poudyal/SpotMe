import { z } from 'zod';
export declare const updateEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    eventName: z.ZodOptional<z.ZodString>;
    thumbNailId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    eventName?: string | undefined;
    thumbNailId?: string | undefined;
}, {
    eventId: string;
    eventName?: string | undefined;
    thumbNailId?: string | undefined;
}>;
export type UpdateRequestPayload = z.infer<typeof updateEventSchema>;
//# sourceMappingURL=event.validation.d.ts.map