import { auth } from '../config/auth';
import { redis } from '../config/redisConfig';
import { CachedUser } from '../types/cachedUser';

const getSession = async (headers: HeadersInit) => {
  const cookieHeader =
    (headers as Record<string, string>)['cookie'] ||
    (headers as Record<string, string>)['Cookie'] ||
    '';
  const token = cookieHeader.split('better-auth.session_token=')[1]?.split(';')[0];

  if (token) {
    const raw = await redis.get(`session:${token}`);
    const cachedUser: CachedUser | null = raw ? JSON.parse(raw) : null;
    if (cachedUser) {
      return { user: cachedUser };
    }
  }
  const session = await auth.api.getSession({ headers });

  if (session && token) {
    await redis.set(`session:${token}`, JSON.stringify(session.user), 'EX', 600);
  }
  return session;
};
export { getSession };
