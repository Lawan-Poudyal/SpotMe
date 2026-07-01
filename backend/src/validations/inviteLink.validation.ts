import { z } from 'zod';

export const inviteLinkSchema = z.object({
  token: z.string().min(1, 'token cannot be empty'),
});

export type InviteLinkSchema = z.infer<typeof inviteLinkSchema>;
