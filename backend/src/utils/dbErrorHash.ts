//UniqueConstraintViolation P2002
//ForeignKeyConstraintViolation P2003

export type dbErrorType = "UniqueConstraintViolation" | "ForeignKeyConstraintViolation"  | "KeyNotFoundError"

type dbErrorHashType = Record<string , dbErrorType>
const dbErrorHash : dbErrorHashType={
    "P2002" : "UniqueConstraintViolation",
    "P2003" : "ForeignKeyConstraintViolation",
    "P2025" : "KeyNotFoundError",
}
export default dbErrorHash 
