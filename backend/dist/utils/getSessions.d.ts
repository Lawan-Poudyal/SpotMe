import { CachedUser } from '../types/cachedUser';
declare const getSession: (headers: HeadersInit) => Promise<{
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined | undefined;
        userAgent?: string | null | undefined | undefined;
        testField: string;
    };
    user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined | undefined;
    };
} | {
    user: CachedUser;
} | null>;
export { getSession };
//# sourceMappingURL=getSessions.d.ts.map