import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prismaClientConfig";
import { createAuthMiddleware  , APIError} from "better-auth/api";
import {checkEmailValidity, checkPasswordValidity, checkUsernameValidity} from "../utils/formValidation"
import type { passwordError } from "../utils/formValidation";
import { sendEmail } from "../utils/sendEmail";
export const auth = betterAuth({
    emailVerification:{
	sendVerificationEmail : async({user, url})=>{
	    void sendEmail(user.email , url)
	}
	,
    sendOnSignIn : true,
    autoSignInAfterVerification : true
    },
    
    hooks:{
	before : createAuthMiddleware(async (ctx)=>{
	    if(ctx.path !== "/sign-up/email"){
		return;
	    }
	    if (checkUsernameValidity(ctx.body?.name)) {
                throw new APIError("BAD_REQUEST", {
                    message: "username must be atleast 8 characters long",
                });
            }
	    const passwordValidity = checkPasswordValidity(ctx.body?.password) as passwordError 
	    if(passwordValidity.totalLength){
                throw new APIError("BAD_REQUEST", {
                    message: "password must be atleast 8 characters long",
                });
	    }
	    else if(passwordValidity.num){
                throw new APIError("BAD_REQUEST", {
                    message: "password must contain at least one number",
                });
	    }
	    else if(passwordValidity.symbol){
                throw new APIError("BAD_REQUEST", {
                    message: "password must contain at least one symbol",
                });
	    }
	})
    },
    emailAndPassword : {
	enabled : true,
	autoSignIn : false,
	requireEmailVerification : true
    },
    session : {
	// so deferSessionRefresh makes it so "GET" only reads and when refresh is required it sends needsRefresh:true field which then client sees and sends in another "POST" request to write to the database
	deferSessionRefresh : true  ,
	cookieCache:{
	    enabled:true,
	    maxAge : 5 * 60,
	    // look at the strategy to encode this using compact (default), jwt and jwe methods
	},
	additionalFields : {
	    testField : {
		type : "string",
		input : true 
	    }
	}
    },
    database : prismaAdapter(prisma , {
	provider : "postgresql"
    }),
    trustedOrigins : [
	String(process.env.FRONTEND_ORIGIN)
    ],
    socialProviders: {
	google : {
	    prompt : "select_account consent",
	    clientId : process.env.CLIENT_ID as string,
	    clientSecret : process.env.CLIENT_SECRET as string,
	    accessType : "offline",
	    scope: ["https://www.googleapis.com/auth/drive.file"],
	}
    }

})
