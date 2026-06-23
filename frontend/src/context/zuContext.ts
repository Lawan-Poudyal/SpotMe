import {create} from 'zustand'
import type { UserContextPayloadType } from '../types/userContextType';

export type zuContextType = UserContextPayloadType & {
    setProfile : ({loggedIn , id , email , userName , emailVerified , profilePicLink} : UserContextPayloadType)=>void
}

export const useProfile = create<zuContextType>(set =>({
    loggedIn : false,
    id : "",
    email : "",
    userName : "",
    emailVerified : false,
    profilePicLink : null,

    setProfile : (payload : UserContextPayloadType)=>{
	set(payload)
    } 
}))
