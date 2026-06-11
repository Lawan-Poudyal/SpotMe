import { ImageBox } from "../components/ImageBox" 
import realDipper from "../assets/realDipper.jpg"
import { LoginBox } from "../components/LoginBox"
import { useState } from "react"
import type { LoginOrSignUp } from "../types/LoginOrSignUpType"
import PopUpBox from "../components/PopupBox"
export function LoginPage({loggedIn}  : LoginOrSignUp) : React.ReactNode{
    const [openRegistrationPopUp , setOpenRegistrationPopUp] = useState<boolean>(false)
    const [openErrorPopUp , setOpenErrorPopUp] = useState<boolean>(false)
    const [errorMsg , setErrorMsg] = useState<string>("")
    return(
	<div className="h-screen w-full bg-[#585289] flex flex-row flex-nowrap justify-center items-center p-8 relative">
	    <div className="h-full w-[75%]  rounded-2xl  bg-[#F5F5F5]   flex flex-row justify-start flex-nowrap overflow-hidden">
		<PopUpBox title="Successfully Registered" subTitle="Close this dialog and log in to the system" open={openRegistrationPopUp} setOpen={setOpenRegistrationPopUp}/>	
		<PopUpBox title="⚠️ Submission Error" subTitle={errorMsg} open={openErrorPopUp} setOpen={setOpenErrorPopUp}/>	
		<ImageBox imgSrc={realDipper} autoBalance="width"/>
		<LoginBox loggedIn={loggedIn} open={openRegistrationPopUp} setOpen={setOpenRegistrationPopUp} openError={openErrorPopUp} setOpenErrorPopUp={setOpenErrorPopUp} setErrorMsg={setErrorMsg} />
	    </div>
	</div>
    )
}
