// this one is for server
import 'dotenv/config';
import { Server } from 'socket.io';
import { corsOptions } from './config/corsOptions';
import { redis } from './config/redisConfig';
import { redisPubSubClient } from './config/redisPubSub';

let io : Server; 

let idMap = new Map<string, string>()

export const initSocket = async (server: any) => {
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

  await redisPubSubClient.subscribe("image_news")
  redisPubSubClient.on("message" , (channel, message)=>{
      try{
      const data = JSON.parse(message)
      const userId = data.userId 
      const driveFileId = data.driveFileId
      const success = data.success
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
  await redisPubSubClient.subscribe("find_me_image")
  redisPubSubClient.on("message" , (channel, message)=>{
      try{
      const data = JSON.parse(message)
      const userId = data.userId 
      const driveFileId = data.driveFileId
      const success = data.success
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
