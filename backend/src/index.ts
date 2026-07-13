import 'dotenv/config';
import 'express-async-errors';
import app,{server} from './app';
import './config/redisConfig';
const PORT = process.env.PORT ?? 5000;

async function startServer() {

  server.listen(PORT, () => {
    console.log('Server running');
  });
}

startServer();
