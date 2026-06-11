import { TextField , Button} from '@mui/material'
import {useState , useRef , useEffect} from "react"
import { useNavigate } from 'react-router-dom'
import google from "../assets/google.svg"
import type { LoginOrSignupBox } from '../types/LoginOrSignUpType'
import {Eye , EyeOff} from 'lucide-react'
import { checkUsernameValidity , checkEmailValidity , checkPasswordValidity} from '../utility/formValidation'
import type { passwordError } from '../utility/formValidation'
import { handleLogIn as logInApi} from '../api/log-in'
import { handleSignUp as signUpApi} from '../api/sign-up'
import { googleSignIn } from '../api/google-sign-in'
import { handleEmailUniqueness } from '../api/checkEmailUniquness.js'
import { UserContext } from '../context/UserContext.js'
import { useContext } from 'react'
// the loogedIn variable is written in a bad way it's acutally determines whether the user wants to log in or sign up

export function LoginBox({loggedIn , open , setOpen , setErrorMsg , setOpenErrorPopUp , openError} : LoginOrSignupBox ) : React.ReactNode{
    const timerReference = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [userName ,setUserName] = useState<string>("")
    const [email ,setEmail] = useState<string>("")
    const [password ,setPassword] = useState<string>("")
    const [seePassword , setSeePassword] = useState<boolean>(false)
    const [isPassword , setIsPassword] = useState<boolean>(true)
    const [passwordErrorMessage , setPasswordErrorMessage] = useState<passwordError>({num: true , totalLength :true , symbol : true})
    const [userNameErrorMessage , setUserNameErrorMessage] = useState<boolean>(true)
    const [emailErrorMessage , setEmailErrorMessage] = useState<boolean>(true)
    const [isLogInLoading , setIsLogInLoading] = useState<boolean>(false)
    const [isSignUpLoading , setIsSignUpLoading] = useState<boolean>(false)
    const [isEmailUniqueError , setIsEmailUniqueError] = useState<boolean>(true)
    const userInfo = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(()=>{
	if(userInfo?.contextState?.loggedIn){
	    navigate("/dashboard")
	}
    } , [])

    const debouncerFunction = async (email : string)=>{
	setIsEmailUniqueError(true)
	if (checkEmailValidity(email) || loggedIn) return
	if (timerReference.current){
	    clearTimeout(timerReference.current as number)
	    timerReference.current = null
	}
	timerReference.current = setTimeout(async ()=>{
	    await handleEmailUniqueness(email , setErrorMsg , setOpenErrorPopUp , setIsEmailUniqueError)
	}, 1000)	
    }

    const handleLogin = async ()=>{
	await logInApi(String(email) , String(password) , true,setOpenErrorPopUp , setErrorMsg , setIsLogInLoading) 
    }

    const checkSubmissionPermission = ()=>{
	if(userNameErrorMessage || emailErrorMessage || passwordErrorMessage.num || passwordErrorMessage.symbol || passwordErrorMessage.totalLength || isEmailUniqueError) return false
	else return true
    } 

    const handleSingUp = async()=>{
	if (loggedIn) return
	if(checkSubmissionPermission()){
	    console.log(password)
	    await signUpApi(userName , email , password , setIsSignUpLoading , setOpen , setErrorMsg , setOpenErrorPopUp)
	}
    }

    const handleFormValidation = (validateWhat : "userName" | "email" | "password" , validationString : string)=>{
	
	if(validateWhat === "userName")  {
	    const userNameError  = checkUsernameValidity(validationString)
	    setUserNameErrorMessage(userNameError)
	}

	else if(validateWhat === "email")  {
	    const emailError = checkEmailValidity(validationString)
	    setEmailErrorMessage(emailError)
	}

	else if(validateWhat === "password")  {
	    const passwordError = checkPasswordValidity(validationString)
	    setPasswordErrorMessage(passwordError)
	}
	
    }

    return(
	<div className=" w-[50%] h-full p-8 flex flex-col justify-around ">
	    <div className="flex flex-col justify-around h-[25%]  ">
		<h1 className="text-[#354283] font-bold font-mono text-7xl">Dipper</h1> 
		<h1 className="text-black font-bold font-mono">{(loggedIn) ? "Welcome, Back" : "Create an account"}</h1> 
		</div>
		<div className="flex flex-col justify-start h-[75%] mt-20 gap-8 ">
		{
		    (!loggedIn) ?
		<div className="w-full flex flex-row flex-nowrap relative">
		<TextField label="User Name" variant="outlined"  required
		size="medium"
		value={userName}
		onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{
		    setUserName(e.target.value)
		    handleFormValidation("userName" , e.target.value)
		}}
		className="w-full grow"
		>
		</TextField>
		{
		    (userNameErrorMessage && String(userName).trim().length !== 0 && userName !== null && !loggedIn) ? <span 
			className="text-red-500 absolute top-16 "
		    >
			user name must be 8 characters long	
		    </span>  : <> </>
		}
		</div>
		: <> </>
		}
		<div className="w-full flex flex-row flex-nowrap relative">
		<TextField label="Email" variant="outlined"  required
		size="medium"
		value={email}
		onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{
		    setEmail(e.target.value)
		    debouncerFunction(e.target.value)
		    handleFormValidation("email" , e.target.value)
		}}
		className="w-full grow"
		>
		</TextField>
		{
		    (emailErrorMessage && String(email).trim().length !== 0 && email !== null && !loggedIn) ? <span 
			className="text-red-500 absolute top-16 "
		    >
		    email format wrong
		    </span>  :
		    (isEmailUniqueError && String(email).trim().length !==0 && email !==null && !loggedIn) ? <span
			className="text-red-500 absolute top-16 "
		    >
		    email already in use
		    </span> 
			:<> </>
		}
		</div>
		<div className="w-full flex flex-row flex-nowrap relative">
		<TextField label="Password" variant="outlined"  required
		size="medium"
		type={(isPassword) ? "password" : "text"}
		value={password}
		onChange={(e : React.ChangeEvent<HTMLInputElement>)=>{
		    setPassword(e.target.value)
		    handleFormValidation("password" , e.target.value)
		}}
		className="w-full grow"
		>
		</TextField>
		{
		    (!seePassword) ? <EyeOff size={24} color="black"
		className="absolute top-4 right-5"
		onClick={()=>{setSeePassword(true)
		    setIsPassword(false)
		}
		}
		/>
		:
		<Eye size={24} color="black"
		className="absolute top-4 right-5" 
		onClick={()=>{setSeePassword(false)
		    setIsPassword(true)
		}}
		/>
		}
		{
		    ((passwordErrorMessage.totalLength || passwordErrorMessage.symbol || passwordErrorMessage.num)  && String(password).trim().length !== 0 && password !== null && !loggedIn) ? <span 
			className="text-red-500 absolute top-16 "
		    >

		    {(passwordErrorMessage.totalLength) ? "password must be 8 characters long"  : (passwordErrorMessage.num) ? "password must contain at least one number " : (passwordErrorMessage.symbol) ? "password must contain at least one symbol" : ""}

		    </span>  : <> </>
		}
		</div>
		<span className=" text-center cursor-pointer underline text-blue-500"
		    onClick = {()=>{navigate(
			(loggedIn) ? "../signup" : "../login"
		    )}}
		>
		{(loggedIn) ? "Don't have an account" : "Already have an account" }
		</span>
		<Button
		    variant="outlined"
		    color = "primary"
		    sx={{
			height : 50,
			width  : "100%"
		    }}
		    disabled= {(loggedIn) ? (isLogInLoading) ? true : false :(isSignUpLoading) ? true : (!checkSubmissionPermission()) ? true : false }
		    onClick = {()=>{
			if(loggedIn){handleLogin()}
			else {handleSingUp()}
		    }}
		>
		{(loggedIn) ? "Log In" : "Sign Up"} 
		</Button>
		<Button
		    onClick = {googleSignIn}
		    className="flex felx-col gap-2"
		    variant="contained"
		    color = "primary"
		    sx={{
			height : 50,
			width  : "100%",
			backgroundColor : "white",
			color : "black",
		    }}
		>

		{(loggedIn) ? "Login with google" : "Sign up with google"}<img src={google} style={{width:30 , height : 30}}/>
		</Button>

	    </div>
	</div>
    )
}

