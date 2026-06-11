import express from 'express'
import { createEventHandler , getEventHandler, updateEventHandler} from '../controllers/eventController.js'
const router = express.Router()

router.route("/").post(createEventHandler).get(getEventHandler).put(updateEventHandler)

export {router}
