import { Queue } from 'bullmq';
import { connection } from '../config/redis';

export const emailQueue = new Queue('email', { connection });

export async function addEmailJob(data: { to: string; subject: string; body: string }) {
  await emailQueue.add('send-email', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });
}
