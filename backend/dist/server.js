"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
// this one is for server
require("dotenv/config");
const socket_io_1 = require("socket.io");
const corsOptions_1 = require("./config/corsOptions");
const redisPubSub_1 = require("./config/redisPubSub");
let io;
let idMap = new Map();
const initSocket = async (server) => {
    io = new socket_io_1.Server(server, {
        cors: corsOptions_1.corsOptions,
    });
    io.on('connection', (socket) => {
        const userId = socket.handshake.auth.userId;
        if (userId) {
            idMap.set(userId, socket.id);
            socket.join(socket.handshake.auth.eventId);
        }
        console.log('connected:', socket.id, "and joined: ", socket.handshake.auth.eventId);
    });
    await redisPubSub_1.redisPubSubClient.subscribe('image_news', 'find_me_image', 'embedding_news', 'reference_embedding_news');
    redisPubSub_1.redisPubSubClient.on('message', (channel, message) => {
        try {
            if (channel === 'image_news' || channel === 'find_me_image') {
                const data = JSON.parse(message);
                const { userId, driveFileId, success } = data;
                const socketId = idMap.get(userId);
                if (!socketId)
                    return; // user not connected on this instance
                io.to(socketId).emit(channel, { success, driveFileId });
                if (channel === "image_news") {
                    const { userId, driveFileId, success, photoData } = data;
                    if (success)
                        io.except(userId).to(photoData?.event_id).emit("dynamic_singular_image", photoData);
                }
            }
            else if (channel === 'embedding_news') {
                const data = JSON.parse(message);
                const { success, photoId, eventId } = data;
                console.log('From the socket listener we have');
                console.log({ success, photoId, eventId });
            }
            else if (channel === 'reference_embedding_news') {
                const data = JSON.parse(message);
                const { success, photoId, eventId, ownerId } = data;
                const socketId = idMap.get(ownerId);
                if (!socketId)
                    return;
                io.to(socketId).emit(channel, { success, photoId, eventId, ownerId });
            }
        }
        catch (err) {
            if (err instanceof Error)
                console.log(err.stack);
        }
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error('Socket not initialized');
    return { io: io, idMap: idMap };
};
exports.getIO = getIO;
//# sourceMappingURL=server.js.map