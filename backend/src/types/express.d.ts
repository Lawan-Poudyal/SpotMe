declare namespace Express {
  interface Request {
    validatedUserId: string;
    eventId?: string;
  }
}
