"use strict";
//UniqueConstraintViolation P2002
//ForeignKeyConstraintViolation P2003
Object.defineProperty(exports, "__esModule", { value: true });
const dbErrorHash = {
    "P2002": "UniqueConstraintViolation",
    "P2003": "ForeignKeyConstraintViolation",
    "P2025": "KeyNotFoundError",
};
exports.default = dbErrorHash;
//# sourceMappingURL=dbErrorHash.js.map