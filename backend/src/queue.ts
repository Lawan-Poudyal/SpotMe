import 'dotenv/config';
import './jobs/worker/reference_photo.worker'
import './jobs/worker/photo.worker';
import './jobs/worker/generate_embeddings.worker';
console.log("Worker started");
