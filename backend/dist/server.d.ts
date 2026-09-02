import 'dotenv/config';
import { Server } from 'socket.io';
export declare const initSocket: (server: any) => Promise<Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>>;
export declare const getIO: () => {
    io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
    idMap: Map<string, string>;
};
//# sourceMappingURL=server.d.ts.map