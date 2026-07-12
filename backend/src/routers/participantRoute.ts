import { Router } from 'express';
import { getParticipants } from '../controllers/participantCountController';

const router = Router();

router.get('/:eventId/:ownerId', getParticipants);

export { router };