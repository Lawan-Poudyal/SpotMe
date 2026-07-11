import { z } from 'zod';

export const eventSchema = z.object({
  eventId: z.string().trim().uuid('Invalid eventId format'),
});

export const saveUploadSchema = z.object({
  photos: z
    .array(
      z.object({
        url: z.string().trim().url(),
        publicId: z.string().trim().min(1).max(255),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      }),
    )
    .min(1)
    .max(20),
});

export const deletePhotoSchema = z.object({
  photoId: z.string().trim().uuid('Missing or invalid photoId in the request '),
});

export type SignUploadRequestPayload = z.infer<typeof eventSchema>;
export type SaveUploadRequestPayload = z.infer<typeof saveUploadSchema>;
export type DeletePhotoRequestPaylod = z.infer<typeof deletePhotoSchema>;
