"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueEmailHandler = void 0;
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const uniqueEmailHandler = async (req, res) => {
    try {
        let { email } = req.query;
        email = email.trim();
        if (!email || email.length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'missing email in the request paylaod'
                }
            });
        }
        const userNameExists = await prismaClientConfig_1.prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!userNameExists)
            return res.status(200).json({
                success: true // it is a success becasue we want unique Username
            });
        return res.status(409).json({
            success: false, // because we don't want the user name exisiting
            message: "username already exists"
        });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.stack);
            return res.status(500).json({
                success: false,
                error: {
                    name: err.name,
                    message: err.message
                }
            });
        }
    }
};
exports.uniqueEmailHandler = uniqueEmailHandler;
//# sourceMappingURL=uniqueEmailController.js.map