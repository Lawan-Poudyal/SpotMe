import { z } from 'zod';

export const eventSchema = z.object({
  eventId: z.string().trim().uuid('Invalid eventId format'),
});

export const referencePhotoSchema = z.object({
  eventId: z.string().min(1, 'Missing or invalid eventId in the request '),
  userId : z.string().min(1, 'Missing or invalid userId in the request '),
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

export const saveUploadSingularSchema = z.object({

  userId : z.string().min(1 , 'Missing userId in the request body'),

  eventId: z.string().min(1, 'Missing or invalid eventId in the request body'),

  photo: z.object({
        url: z.string().url(),
        publicId: z.string().min(1).max(255),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
});
export const deletePhotoSchema = z.object({
  photoId: z.string().trim().uuid('Missing or invalid photoId in the request '),
});

export type SignUploadRequestPayload = z.infer<typeof eventSchema>;
export type SaveUploadRequestPayload = z.infer<typeof saveUploadSchema>;
export type DeletePhotoRequestPaylod = z.infer<typeof deletePhotoSchema>;
export type SaveUploadSingularPayload = z.infer<typeof saveUploadSingularSchema>;
export type referencePhotoPaylod = z.infer<typeof referencePhotoSchema>;
