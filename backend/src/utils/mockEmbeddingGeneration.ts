let embeddings = '[0.1 , -0.2 , 0.4]'
export const generateEmbeddings = async(photoId : string , photoURL : string)=>{
    return new Promise((resolve, reject)=>{
	setTimeout(()=>{
	    resolve(embeddings)
	} , 1000)
    })
}
