import { authClient } from "../utility/auth-client.ts"; //import the auth client

export const googleSignIn = async()=>{
    const data = await authClient.signIn.social({
	provider : "google",
	callbackURL : "http://localhost:5173/dashboard"
    })
}
