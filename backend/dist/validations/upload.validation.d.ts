import { z } from 'zod';
export declare const eventSchema: z.ZodObject<{
    eventId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    eventId: string;
}, {
    eventId: string;
}>;
export declare const referencePhotoSchema: z.ZodObject<{
    eventId: z.ZodString;
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    eventId: string;
}, {
    userId: string;
    eventId: string;
}>;
export declare const saveUploadSchema: z.ZodObject<{
    eventId: z.ZodString;
    photos: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        url: string;
        width: number;
        height: number;
        publicId: string;
    }, {
        url: string;
        width: number;
        height: number;
        publicId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    photos: {
        url: string;
        width: number;
        height: number;
        publicId: string;
    }[];
    eventId: string;
}, {
    photos: {
        url: string;
        width: number;
        height: number;
        publicId: string;
    }[];
    eventId: string;
}>;
export declare const saveUploadSingularSchema: z.ZodObject<{
    userId: z.ZodString;
    eventId: z.ZodString;
    photo: z.ZodObject<{
        url: z.ZodString;
        publicId: z.ZodString;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        url: string;
        width: number;
        height: number;
        publicId: string;
    }, {
        url: string;
        width: number;
        height: number;
        publicId: string;
    }>;
    existingPhotoId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    userId: string;
    photo: {
        url: string;
        width: number;
        height: number;
        publicId: string;
    };
    eventId: string;
    existingPhotoId: string;
}, {
    userId: string;
    photo: {
        url: string;
        width: number;
        height: number;
        publicId: string;
    };
    eventId: string;
    existingPhotoId: string;
}>;
export declare const deletePhotoSchema: z.ZodObject<{
    photoId: z.ZodString;
    eventId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    eventId: string;
    photoId: string;
}, {
    eventId: string;
    photoId: string;
}>;
export type SignUploadRequestPayload = z.infer<typeof eventSchema>;
export type SaveUploadRequestPayload = z.infer<typeof saveUploadSchema>;
export type DeletePhotoRequestPaylod = z.infer<typeof deletePhotoSchema>;
export type SaveUploadSingularPayload = z.infer<typeof saveUploadSingularSchema>;
export type referencePhotoPaylod = z.infer<typeof referencePhotoSchema>;
//# sourceMappingURL=upload.validation.d.ts.map