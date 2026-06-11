import axios from "axios";
import type {Dispatch , SetStateAction} from 'react'

const handleEmailUniqueness = async(email : string, setErrMsg : Dispatch<SetStateAction<string>>, setOpenError : Dispatch<SetStateAction<boolean>>, setUniqunessError: Dispatch<SetStateAction<boolean>>)=>{
    try{
	const data = await axios.get("http://localhost:5000/uniqueEmail", {
	    params :{
		email : email
	    }
	})
	
	if(data.status === 200){
	    setUniqunessError(false)
	}

    }
    catch(err : unknown){
	if(axios.isAxiosError(err)){
	    if(err.response?.status === 409){
		setUniqunessError(true)
	    }
	    else{
		setOpenError(true)
		setErrMsg("internal server error")
	    }
	}
    }
}

export {handleEmailUniqueness}
