"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbeddings = generateEmbeddings;
exports.generateSelfieEmbedding = generateSelfieEmbedding;
const axios_1 = __importDefault(require("axios"));
const FACE_SERVICE_URL = process.env.FACE_SERVICE_URL;
const FACE_SERVICE_KEY = process.env.FACE_SERVICE_KEY;
async function generateEmbeddings(photoId, photoURL) {
    const response = await axios_1.default.post(`${FACE_SERVICE_URL}/api/embeddings/photo`, { photo_id: photoId, url: photoURL }, { headers: { 'X-Internal-Key': FACE_SERVICE_KEY }, timeout: 30000 });
    return response.data;
}
async function generateSelfieEmbedding(participantId, photoURL, eventId) {
    const response = await axios_1.default.post(`${FACE_SERVICE_URL}/api/embeddings/selfie`, { participant_id: participantId, url: photoURL, event_id: eventId }, { headers: { 'X-Internal-Key': FACE_SERVICE_KEY }, timeout: 30000 });
    return response.data;
}
//# sourceMappingURL=faceService.js.map