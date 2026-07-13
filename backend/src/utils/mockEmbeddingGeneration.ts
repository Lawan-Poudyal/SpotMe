let embeddings : number[] = []
let a = 512;
while(a !==0){
    embeddings.push(0.1)
    a -= 1
}

let another_embedding = JSON.stringify(embeddings)

export const generateEmbeddings = async(photoId : string , photoURL : string)=>{
    return new Promise((resolve, reject)=>{
	setTimeout(()=>{
	    resolve(another_embedding)
	} , 1000)
    })
}
