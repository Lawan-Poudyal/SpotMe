import {createPhotoHandler , createReferencePhotoHandler} from "../controllers/asyncGooglePhotoUploadController"
import express from 'express'
const router = express.Router()

router.route("/").post(createPhotoHandler)
router.route("/referencePhoto").post(createReferencePhotoHandler)
export {router}
