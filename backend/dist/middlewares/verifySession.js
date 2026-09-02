"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const auth_1 = require("../config/auth");
const node_1 = require("better-auth/node");
async function requireAuth(req, res, next) {
    const session = await auth_1.auth.api.getSession({
        headers: (0, node_1.fromNodeHeaders)(req.headers),
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
//# sourceMappingURL=verifySession.js.map