import express from 'express'
import { getAPIKeyHandler } from '../controllers/googleAPIRequest'
const router = express.Router()

router.route("/").get(getAPIKeyHandler)

export {router}
