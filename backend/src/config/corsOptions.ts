export const corsOptions = {
  origin: [String(process.env.FRONTEND_ORIGIN)],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
};
