import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import { auth } from './config/auth'
import { toNodeHandler } from 'better-auth/node'
import {router as uniqueEmailController} from "./routers/uniqueEmailRoute"
import {router as eventController} from "./routers/eventRoute"
import { corsOptions } from './config/corsOptions'

const app = express()
app.get("/", (req, res)=>{res.redirect(process.env.FRONTEND_ORIGIN as string)})
app.use(cookieParser())
app.use(cors(corsOptions))
app.all("/api/auth/*splat" , toNodeHandler(auth))
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uniqueEmail" , uniqueEmailController)
app.use("/event" , eventController)

export default app;
