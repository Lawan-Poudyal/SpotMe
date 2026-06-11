import nodemailer from "nodemailer" 
const sendEmail = async (email : string , text : string)=>{
    try{

	const transporter = nodemailer.createTransport(
	    {
		service : "gmail",
		auth :{
		    user : process.env.EMAIL,
		    pass : process.env.EMAIL_PASSKEY
		}
	    }
	)

    await transporter.sendMail({
      from: "SpotME",
      to: email,
      subject: "Clink the link below",
      html : `<a href="${text}">link</a>` 
    })

    }
    catch(err : unknown){

	if(err instanceof Error){
	    console.log(err.name)
	    console.log(err.stack)
	    throw new Error("couldn't send an email")
	}

    }
}

export {sendEmail} 
