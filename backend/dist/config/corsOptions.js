"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: [String(process.env.FRONTEND_ORIGIN), 'http://localhost:4173'],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
};
//# sourceMappingURL=corsOptions.js.map