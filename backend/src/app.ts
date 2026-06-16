import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { auth } from './config/auth';
import { toNodeHandler } from 'better-auth/node';
import { router as uniqueEmailController } from './routers/uniqueEmailRoute';
import { router as eventController } from './routers/eventRoute';
import { corsOptions } from './config/corsOptions';
import { signUploadrouter } from './routers/signUploadRoute';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.redirect(process.env.FRONTEND_ORIGIN as string);
});

app.all('/api/auth/*', toNodeHandler(auth));

app.use('/uniqueEmail', uniqueEmailController);
app.use('/event', eventController);
app.use('/api/sign-upload', signUploadrouter);

export default app;
