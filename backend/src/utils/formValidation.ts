// here true means error exists for the field and false means the error doesn't exists for the field

export type passwordError = {
    symbol : boolean;
    num : boolean;
    totalLength : boolean;
}


const checkUsernameValidity : (userName : string) => boolean = (userName : string) => {

    userName = userName.trim()
 
    const totalLength = userName.length

    if(totalLength >=8) return false
    
    else return true
};

const checkEmailValidity  : (email : string) => boolean = (email : string)=>{
    email = email.trim()

    const emailRegex : RegExp =   /[^\s@]+@[^\s@]+\.[^\s@]+$/


    return !emailRegex.test(email)
}

const checkPasswordValidity : (password : string) => passwordError = (password : string)=>{
    password = password.trim()
    const passwordSymbolRegex : RegExp = /[^a-zA-Z0-9]+/
    const passwordNumberRegex : RegExp = /[0-9]+/
    const passwordLength = password.length

    return {symbol : !passwordSymbolRegex.test(password) , num : !passwordNumberRegex.test(password) , totalLength : !(passwordLength >= 8) }
}



export {checkUsernameValidity , checkEmailValidity , checkPasswordValidity }


