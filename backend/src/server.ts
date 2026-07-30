// this one is for server
import 'dotenv/config';
import { Server } from 'socket.io';
import { corsOptions } from './config/corsOptions';
import { redisPubSubClient } from './config/redisPubSub';

let io: Server;

let idMap = new Map<string, string>();

export const initSocket = async (server: any) => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;
    if (userId) {
      idMap.set(userId, socket.id);
      socket.join(socket.handshake.auth.eventId)
    }
    console.log('connected:', socket.id, "and joined: " , socket.handshake.auth.eventId );
  });

  await redisPubSubClient.subscribe(
    'image_news',
    'find_me_image',
    'embedding_news',
    'reference_embedding_news',
  );
  redisPubSubClient.on('message', (channel, message) => {
    try {
      if (channel === 'image_news' || channel === 'find_me_image') {
        const data = JSON.parse(message);
        const { userId, driveFileId, success } = data;
        const socketId = idMap.get(userId);

        if (!socketId) return; // user not connected on this instance

        io.to(socketId).emit(channel, { success, driveFileId });

	if(channel === "image_news"){

	    const {userId , driveFileId , success , photoData} = data;

	    if(success) io.except(userId).to(photoData?.event_id).emit("dynamic_singular_image", photoData)

	}

      } else if (channel === 'embedding_news') {
        const data = JSON.parse(message);
        const { success, photoId, eventId } = data;
        console.log('From the socket listener we have');
        console.log({ success, photoId, eventId });

      } else if (channel === 'reference_embedding_news') {

        const data = JSON.parse(message);
        const { success, photoId, eventId, ownerId } = data;

	const socketId = idMap.get(ownerId)

	if(!socketId) return;

	io.to(socketId).emit(channel , {success , photoId , eventId , ownerId})

      }
    } catch (err) {
      if (err instanceof Error) console.log(err.stack);
    }
  });
  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket not initialized');
  return { io: io, idMap: idMap };
};
