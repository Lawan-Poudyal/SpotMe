import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prismaClientConfig.js';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import {
  checkEmailValidity,
  checkPasswordValidity,
  checkUsernameValidity,
} from '../utils/formValidation.js';
import type { passwordError } from '../utils/formValidation.js';
import { sendEmail } from '../utils/sendEmail.js';
export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendEmail(user.email, url);
      } catch (err) {
        console.error('Failed to send verification email:', err);
        // decide: rethrow as APIError so better-auth surfaces it properly,
        // or swallow it if you don't want signup to fail on email issues
      }
    },
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/sign-up/email') {
        return;
      }
      if (checkUsernameValidity(ctx.body?.name)) {
        throw new APIError('BAD_REQUEST', {
          message: 'username must be atleast 8 characters long',
        });
      }
      const passwordValidity = checkPasswordValidity(ctx.body?.password) as passwordError;
      if (passwordValidity.totalLength) {
        throw new APIError('BAD_REQUEST', {
          message: 'password must be atleast 8 characters long',
        });
      } else if (passwordValidity.num) {
        throw new APIError('BAD_REQUEST', {
          message: 'password must contain at least one number',
        });
      } else if (passwordValidity.symbol) {
        throw new APIError('BAD_REQUEST', {
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
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [String(process.env.FRONTEND_ORIGIN)],
  socialProviders: {
    google: {
      prompt: 'select_account consent',
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      accessType: 'offline',
    },
  },
});
