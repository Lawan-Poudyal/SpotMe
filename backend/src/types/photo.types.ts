import { Server } from "socket.io";
export type requestPayloadMultiple = {
    eventId : string;
    ownerId : string;
    accessToken : string;
    driveFileIds : string[];
}

export type requestPayloadSingular = {
    eventId : string;
    ownerId : string;
    accessToken : string;
    driveFileId : string;
    existingPhotoId : string;
}
