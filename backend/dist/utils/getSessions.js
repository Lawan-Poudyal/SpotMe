"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = void 0;
const auth_1 = require("../config/auth");
const redisConfig_1 = require("../config/redisConfig");
const getSession = async (headers) => {
    const cookieHeader = headers['cookie'] ||
        headers['Cookie'] ||
        '';
    const token = cookieHeader.split('better-auth.session_token=')[1]?.split(';')[0];
    if (token) {
        const raw = await redisConfig_1.redis.get(`session:${token}`);
        const cachedUser = raw ? JSON.parse(raw) : null;
        if (cachedUser) {
            return { user: cachedUser };
        }
    }
    const session = await auth_1.auth.api.getSession({ headers });
    if (session && token) {
        await redisConfig_1.redis.set(`session:${token}`, JSON.stringify(session.user), 'EX', 600);
    }
    return session;
};
exports.getSession = getSession;
//# sourceMappingURL=getSessions.js.map