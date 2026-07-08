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

  await redisPubSubClient.subscribe("image_news",  "find_me_image")
  redisPubSubClient.on("message", (channel, message) => {
  try {
      console.log("Find me image is being called once again")
    const data = JSON.parse(message);
    const { userId, driveFileId, success } = data;

    const socketId = idMap.get(userId);
    if (!socketId) return; // user not connected on this instance

    if (channel === "image_news" || channel === "find_me_image") {
      io.to(socketId).emit(channel, { success, driveFileId });
    }
  } catch (err) {
    if (err instanceof Error) console.log(err.stack);
  }
});
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return {io : io , idMap: idMap};
};
