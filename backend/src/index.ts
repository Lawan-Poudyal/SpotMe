import 'dotenv/config';
import 'express-async-errors';
import app from './app';

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
});
