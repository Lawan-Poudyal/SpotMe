import {createPhotoHandler} from "../controllers/asyncGooglePhotoUploadController"
import express from 'express'
const router = express.Router()

router.route("/").post(createPhotoHandler)
export {router}
