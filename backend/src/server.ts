// this one is for server
import 'dotenv/config';
import { Server } from 'socket.io';
import { corsOptions } from './config/corsOptions';

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

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return {io : io , idMap: idMap};
};
