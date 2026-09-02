export interface FaceResult {
    face_index: number;
    embedding: number[];
    bbox: number[];
    det_score: number;
}
export interface PhotoEmbeddingResponse {
    photo_id: string;
    status: 'success' | 'no_face' | 'error';
    faces: FaceResult[];
    error?: string;
}
export interface SelfieEmbeddingResponse {
    participant_id: string;
    status: 'success' | 'error';
    embedding?: number[];
    error?: string;
}
export declare function generateEmbeddings(photoId: string, photoURL: string): Promise<PhotoEmbeddingResponse>;
export declare function generateSelfieEmbedding(participantId: string, photoURL: string, eventId: string): Promise<SelfieEmbeddingResponse>;
//# sourceMappingURL=faceService.d.ts.map