export const corsOptions = 
    {
	origin :[String(process.env.FRONTEND_ORIGIN)], 
	credentials :  true,
	methods : ["POST" ,"DELETE" , "OPTIONS" , "PUT"],
    }
