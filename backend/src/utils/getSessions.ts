import { auth } from '../config/auth';
import { redis } from '../config/redisConfig';
import { CachedUser } from '../types/cachedUser';

const getSession = async (headers: HeadersInit) => {
  console.time('➡ cookie-parse');
  const cookieHeader =
    (headers as Record<string, string>)['cookie'] ||
    (headers as Record<string, string>)['Cookie'] ||
    '';
  const token = cookieHeader.split('better-auth.session_token=')[1]?.split(';')[0];
  console.timeEnd('➡ cookie-parse');

  if (token) {
    console.time('➡ redis-get');
    const raw = await redis.get(`session:${token}`);
    const cachedUser: CachedUser | null = raw ? JSON.parse(raw) : null;
    if (cachedUser) {
      console.log('🔥 CACHE HIT!');
      return { user: cachedUser };
    }
    console.timeEnd('➡ redis-get');
  }
  console.log('❄️ CACHE MISS! Going to Database...');
  const session = await auth.api.getSession({ headers });

  if (session && token) {
    await redis.set(`session:${token}`, JSON.stringify(session.user), 'EX', 600);
  }
  console.timeEnd('➡ better-auth-db-lookup');
  return session;
};
export { getSession };
