import type {Dispatch , SetStateAction} from "react"
export type LoginOrSignUp = {
    loggedIn : boolean
}
export type LoginOrSignupBox = {
    loggedIn : boolean
    open : boolean
    setOpen : Dispatch<SetStateAction<boolean>> 
    openError : boolean
    setOpenErrorPopUp : Dispatch<SetStateAction<boolean>>
    setErrorMsg : Dispatch<SetStateAction<string>>
}
