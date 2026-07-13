import express from 'express';
import {
  createEventHandler,
  getEventHandler,
  updateEventHandler,
  deleteEventHandler,
  getEventById,
} from '../controllers/eventController';
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(createEventHandler)
  .get(getEventHandler)
  .put(updateEventHandler)
  .delete(deleteEventHandler);
router.route('/:eventId').get(getEventById);

export { router };
