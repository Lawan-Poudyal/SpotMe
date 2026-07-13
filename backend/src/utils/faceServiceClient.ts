import axios from 'axios'

const FACE_SERVICE_URL = process.env.FACE_SERVICE_URL!;
const FACE_SERVICE_KEY = process.env.FACE_SERVICE_KEY!;

export interface FaceResult {
    face_index: number;
    embedding: number[];
    bbox: number[];
    det_score: number;
}

export interface PhotoEmbeddingResponse{
    photo_id: string;
    status: 'success' | 'no_face' |'error';
    faces: FaceResult[];
    error?: string;

}

export function generateEmbeddings(
    photoId: string,
    photoURL: string
): Promise<PhotoEmbeddingResponse> {

    const response = await axios.post(
        `${FACE_SERVICE_URL}/api/embeddings/photo`,
        {photo_id: photoId, url: photoURL},
        {headers: {'X-Internal-Key': FACE_SERVICE_KEY}, timeout: 30000},
    );
    return response.data
}