"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPIKeyHandler = void 0;
const auth_1 = require("../config/auth");
const better_auth_1 = require("better-auth");
const getAPIKeyHandler = async (req, res) => {
    try {
        const { validatedUserId } = req;
        let { ownerId } = req.query;
        if (!ownerId || ownerId.trim() === '') {
            return res.status(400).json({
                success: false,
                err: {
                    name: 'Bad request payload',
                    msg: 'Missing owner id in the request payload',
                },
            });
        }
        if (validatedUserId !== ownerId) {
            return res.status(403).json({
                success: false,
                err: {
                    name: 'Unauthorized action intended',
                    message: "You can't get someone elses events",
                },
            });
        }
        let requestBody = null;
        try {
            requestBody = await auth_1.auth.api.getAccessToken({
                body: {
                    accountId: 'google',
                    userId: ownerId,
                },
            });
            if (!requestBody.scopes.includes('https://www.googleapis.com/auth/drive.file')) {
                return res.status(403).json({
                    success: false,
                    err: {
                        name: 'Unauthorized',
                        msg: 'unauthorized_for_google_drive_api',
                    },
                });
            }
        }
        catch (dbError) {
            if (dbError instanceof better_auth_1.APIError) {
                return res.status(404).json({
                    success: false,
                    err: {
                        name: 'Not Found',
                        msg: "The account isn't found ",
                    },
                });
            }
        }
        return res.status(200).json({
            success: true,
            data: requestBody,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log();
            console.log(err.stack);
            return res.status(500).json({
                success: false,
                err: {
                    name: err.name,
                    msg: err.message,
                },
            });
        }
    }
};
exports.getAPIKeyHandler = getAPIKeyHandler;
//# sourceMappingURL=googleAPIRequest.js.map