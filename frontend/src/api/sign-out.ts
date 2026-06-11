import { authClient } from "../utility/auth-client";
import type {NavigateFunction} from "react-router-dom";
import type { Dispatch , SetStateAction } from "react";
import type { UserContextPayloadType } from "../types/userContextType";
export const handleLogOut = async (navigate : NavigateFunction , setContext : Dispatch<SetStateAction<UserContextPayloadType | null>>  )=>{
    await authClient.signOut({
	fetchOptions : {
	    onSuccess : ()=>{
		const toSetPayload : UserContextPayloadType = {
		   loggedIn : false,
		   id : "",
		   userName : "",
		   email : "",
		   emailVerified : false,
		   profilePicLink : ""
		}
		setContext(toSetPayload)
		navigate("/login")
	    } 
	}
    })
}
