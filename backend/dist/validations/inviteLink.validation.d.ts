import { z } from 'zod';
export declare const inviteLinkSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export type InviteLinkSchema = z.infer<typeof inviteLinkSchema>;
//# sourceMappingURL=inviteLink.validation.d.ts.map