import { authClient } from "../utility/auth-client.ts"; //import the auth client
import type { SetStateAction , Dispatch } from "react"; 

export async function handleSignUp(userName : string , email : string , password : string , setIsLoading : Dispatch<SetStateAction<boolean>> , setOpen:Dispatch<SetStateAction<boolean>> , setErrorMsg : Dispatch<SetStateAction<string>> , setOpenError : Dispatch<SetStateAction<boolean>> ){
    await authClient.signUp.email({
	    email:email, // user email address
	    password:password, // user password -> min 8 characters by default
	    name : userName, // user display name
	}, {
	    onRequest: () => {
		// this is where you make the signup button to be disabled  
		console.log("the signup process has begun")
		setIsLoading(true)
	    },
	    onSuccess: () => {
		//redirect to the dashboard or sign in page
		// this is where you free up the disabled signup button 
		console.log("successfully signed up")
		setOpen(true)
		setIsLoading(false)
	    },
	    onError: (ctx) => {
		// display the error message
		// also free up the disabled signup button
		setOpenError(true)
		setErrorMsg(ctx.error.message)
		setIsLoading(false)
	    },
    });
}
