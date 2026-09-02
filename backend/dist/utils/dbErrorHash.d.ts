export type dbErrorType = "UniqueConstraintViolation" | "ForeignKeyConstraintViolation" | "KeyNotFoundError";
type dbErrorHashType = Record<string, dbErrorType>;
declare const dbErrorHash: dbErrorHashType;
export default dbErrorHash;
//# sourceMappingURL=dbErrorHash.d.ts.map