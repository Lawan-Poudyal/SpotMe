import { BetterAuthOptions } from 'better-auth';
declare const baseConfig: {
    emailVerification: {
        sendVerificationEmail: ({ user, url }: {
            user: import("better-auth", { with: { "resolution-mode": "import" } }).User;
            url: string;
            token: string;
        }) => Promise<void>;
        sendOnSignIn: true;
        autoSignInAfterVerification: true;
    };
    hooks: {
        before: import("better-auth", { with: { "resolution-mode": "import" } }).Middleware<import("better-auth", { with: { "resolution-mode": "import" } }).MiddlewareOptions, (inputContext: import("better-auth", { with: { "resolution-mode": "import" } }).MiddlewareInputContext<import("better-auth", { with: { "resolution-mode": "import" } }).MiddlewareOptions>) => Promise<void>>;
    };
    emailAndPassword: {
        enabled: true;
        autoSignIn: false;
        requireEmailVerification: true;
    };
    session: {
        deferSessionRefresh: true;
        cookieCache: {
            enabled: true;
            maxAge: number;
        };
        additionalFields: {
            testField: {
                type: "string";
                input: true;
            };
        };
    };
    database: (options: BetterAuthOptions) => import("better-auth", { with: { "resolution-mode": "import" } }).DBAdapter<BetterAuthOptions>;
    trustedOrigins: string[];
    socialProviders: {
        google: {
            prompt: "select_account consent";
            clientId: string;
            clientSecret: string;
            accessType: "offline";
        };
    };
};
export declare const auth: import("better-auth", { with: { "resolution-mode": "import" } }).Auth<{
    emailVerification: {
        sendVerificationEmail: ({ user, url }: {
            user: import("better-auth", { with: { "resolution-mode": "import" } }).User;
            url: string;
            token: string;
        }) => Promise<void>;
        sendOnSignIn: true;
        autoSignInAfterVerification: true;
    };
    hooks: {
        before: import("better-auth", { with: { "resolution-mode": "import" } }).Middleware<import("better-auth", { with: { "resolution-mode": "import" } }).MiddlewareOptions, (inputContext: import("better-auth", { with: { "resolution-mode": "import" } }).MiddlewareInputContext<import("better-auth", { with: { "resolution-mode": "import" } }).MiddlewareOptions>) => Promise<void>>;
    };
    emailAndPassword: {
        enabled: true;
        autoSignIn: false;
        requireEmailVerification: true;
    };
    session: {
        deferSessionRefresh: true;
        cookieCache: {
            enabled: true;
            maxAge: number;
        };
        additionalFields: {
            testField: {
                type: "string";
                input: true;
            };
        };
    };
    database: (options: BetterAuthOptions) => import("better-auth", { with: { "resolution-mode": "import" } }).DBAdapter<BetterAuthOptions>;
    trustedOrigins: string[];
    socialProviders: {
        google: {
            prompt: "select_account consent";
            clientId: string;
            clientSecret: string;
            accessType: "offline";
        };
    };
}>;
export { baseConfig };
//# sourceMappingURL=auth.d.ts.map