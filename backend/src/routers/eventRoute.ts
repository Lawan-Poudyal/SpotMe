import express from 'express'
import { createEventHandler , getEventHandler, updateEventHandler, deleteEventHandler} from '../controllers/eventController'
const router = express.Router()

router.route("/").post(createEventHandler).get(getEventHandler).put(updateEventHandler).delete(deleteEventHandler)

export {router}
