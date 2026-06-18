import 'dotenv/config';
import 'express-async-errors';
import app from './app';
import { redisClient } from './config/redisConfig';

const PORT = process.env.PORT ?? 5000;

async function startServer() {
  // await redisClient.connect();

  app.listen(PORT, () => {
    console.log('Server running');
  });
}

startServer();
