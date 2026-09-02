"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("express-async-errors");
const app_1 = require("./app");
require("./config/redisConfig");
const PORT = process.env.PORT ?? 5000;
async function startServer() {
    app_1.server.listen(PORT, () => {
        console.log('Server running');
    });
}
startServer();
//# sourceMappingURL=index.js.map