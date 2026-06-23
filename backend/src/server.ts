// this one is for server
import 'dotenv/config';
import { Server } from 'socket.io';
import { corsOptions } from './config/corsOptions';
import { redis } from './config/redisConfig';

let io : Server; 

let idMap = new Map<string, string>()

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId
    if(userId){
	idMap.set(userId , socket.id)
    }
    console.log("connected:", socket.id);
  });

  const subscriber = redis.subscribe(["image_news"])
  subscriber.on("message" , (data)=>{
      try{
      const userId = data.message.userId 
      const driveFileId = data.message.driveFileId
      const success = data.message.success
      console.log(success ,userId , driveFileId)
      console.log(idMap.get(userId) as string)
      io.to(idMap.get(userId) as string).emit("image_news" , {success : success , driveFileId : driveFileId})
      }
      catch(err : unknown){
	  if (err instanceof Error){
	      console.log(err.stack)
	  }
      }
  })

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return {io : io , idMap: idMap};
};
