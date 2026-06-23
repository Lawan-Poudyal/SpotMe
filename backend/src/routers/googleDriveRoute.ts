import {createPhotoHandler} from "../controllers/googlePhotoUploadController"
import express from 'express'
const router = express.Router()

router.route("/").post(createPhotoHandler)
export {router}
