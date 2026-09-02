"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseConfig = exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const prismaClientConfig_js_1 = require("./prismaClientConfig.js");
const api_1 = require("better-auth/api");
const formValidation_js_1 = require("../utils/formValidation.js");
const sendEmail_js_1 = require("../utils/sendEmail.js");
const baseConfig = {
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            try {
                await (0, sendEmail_js_1.sendEmail)(user.email, url);
            }
            catch (err) {
                console.error('Failed to send verification email:', err);
                // decide: rethrow as APIError so better-auth surfaces it properly,
                // or swallow it if you don't want signup to fail on email issues
            }
        },
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
    },
    hooks: {
        before: (0, api_1.createAuthMiddleware)(async (ctx) => {
            if (ctx.path !== '/sign-up/email') {
                return;
            }
            if ((0, formValidation_js_1.checkUsernameValidity)(ctx.body?.name)) {
                throw new api_1.APIError('BAD_REQUEST', {
                    message: 'username must be atleast 8 characters long',
                });
            }
            const passwordValidity = (0, formValidation_js_1.checkPasswordValidity)(ctx.body?.password);
            if (passwordValidity.totalLength) {
                throw new api_1.APIError('BAD_REQUEST', {
                    message: 'password must be atleast 8 characters long',
                });
            }
            else if (passwordValidity.num) {
                throw new api_1.APIError('BAD_REQUEST', {
                    message: 'password must contain at least one number',
                });
            }
            else if (passwordValidity.symbol) {
                throw new api_1.APIError('BAD_REQUEST', {
                    message: 'password must contain at least one symbol',
                });
            }
        }),
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    session: {
        // so deferSessionRefresh makes it so "GET" only reads and when refresh is required it sends needsRefresh:true field which then client sees and sends in another "POST" request to write to the database
        deferSessionRefresh: true,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
            // look at the strategy to encode this using compact (default), jwt and jwe methods
        },
        additionalFields: {
            testField: {
                type: 'string',
                input: true,
            },
        },
    },
    database: (0, prisma_1.prismaAdapter)(prismaClientConfig_js_1.prisma, {
        provider: 'postgresql',
    }),
    trustedOrigins: [String(process.env.FRONTEND_ORIGIN)],
    socialProviders: {
        google: {
            prompt: 'select_account consent',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            accessType: 'offline',
        },
    },
};
exports.baseConfig = baseConfig;
exports.auth = (0, better_auth_1.betterAuth)(baseConfig);
//# sourceMappingURL=auth.js.map