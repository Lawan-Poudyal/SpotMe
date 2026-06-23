import 'dotenv/config';
import 'express-async-errors';
import app from './app';
import './config/redisConfig';
const PORT = process.env.PORT ?? 5000;

async function startServer() {

  app.listen(PORT, () => {
    console.log('Server running');
  });
}

startServer();
