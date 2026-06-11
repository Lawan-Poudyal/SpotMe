import type { SetStateAction  , Dispatch } from "react"
export type popUpBoxType = {
    title : string,
    subTitle : string,
    open : boolean,
    setOpen : Dispatch<SetStateAction<boolean>>
}
