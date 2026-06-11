import express from 'express'
import {uniqueEmailHandler} from "../controllers/uniqueEmailController.js"
const router = express.Router()

router.route("/").get(uniqueEmailHandler)

export {router}
