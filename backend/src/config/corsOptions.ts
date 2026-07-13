export const corsOptions = {
  origin: [String(process.env.FRONTEND_ORIGIN), 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
};
