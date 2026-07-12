import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { auth } from './config/auth';
import "./jobs/cron/schedule_embeddings";
import { toNodeHandler } from 'better-auth/node';
import { router as uniqueEmailController } from './routers/uniqueEmailRoute';
import { router as googleAPIController } from './routers/googleAPIRoute';
import { router as drivePhotoController } from './routers/googleDriveRoute';
import { router as eventController } from './routers/eventRoute';
import { router as getParticipantController } from './routers/participantRoute'
import { corsOptions } from './config/corsOptions';
import { limiter } from './config/rateLimit';
import { uploadrouter } from './routers/uploadRoute';
import { photoRouter } from './routers/photoRoute';
import { requireAuth } from './middlewares/verifySession';
import { initSocket } from './server';
import { globalErrorHandler } from './middlewares/errorHandler';
import { shareRouter } from './routers/inviteRoute';
import { joinRouter } from './routers/joinRouter';

const app = express();
export const server = http.createServer(app);
initSocket(server);

app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.all('/api/auth/*', toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/dashboard/:event', (req, res) => {
  res.redirect(`${process.env.FRONTEND_ORIGIN as string}/dashboard/event/${req.params.event}`);
});
app.get('/', (req, res) => {
  res.redirect(process.env.FRONTEND_ORIGIN as string);
});

app.use('/api/uniqueEmail', uniqueEmailController);
app.use('/api', requireAuth);
app.use('/api/driveUploadAPI', drivePhotoController);
app.use('/api/upload/photo', uploadrouter);
app.use('/api/event/photo', photoRouter);
app.use('/api/driveAPI', googleAPIController);
app.use('/api/event', eventController);
app.use('/api/events/:eventId/share', shareRouter);
app.use('/api/invite-links/:token/join', joinRouter);
app.use("/api/participants", getParticipantController)
app.use(globalErrorHandler);
export default app;
