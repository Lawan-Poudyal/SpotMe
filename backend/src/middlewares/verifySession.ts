import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';
import { fromNodeHeaders } from 'better-auth/node';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    return res.status(401).json({
      success: false,
      err: {
        name: 'Unauthorized access',
        message: 'Unauthorized access attempted',
      },
    });
  }
  req.validatedUserId = session.user.id;
  next();
}
