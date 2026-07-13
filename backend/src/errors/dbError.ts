// this is for the db Error thing right now .
import { AppError } from "./Error";
import type { dbErrorType } from "../utils/dbErrorHash";
import dbErrorHash from "../utils/dbErrorHash";
import { ApiFailurePayload } from "../types/apiFailurePayloadType";
import type { PrismaClientKnownRequestError} from "@prisma/client/runtime/client";
import type { validationFailurePayloadType } from "../types/validationFailurePayloadType";

export class ZodValidationError extends Error{
    status : number
    options : validationFailurePayloadType
    constructor(message : string , status : number,  options? : validationFailurePayloadType){
	super(message)
	this.status = status
	this.options = options as validationFailurePayloadType
    }
}

export class DbError extends AppError{
    payload? : ApiFailurePayload
    constructor(message : string , status : number , options? : {payload : ApiFailurePayload}){
	super(message , status)
	this.payload = options?.payload as ApiFailurePayload
    }
}

export class DbUniqueConstraintViolationError extends DbError {
    constructor(message : string , options? : {payload : ApiFailurePayload}){
	super(message , 409 , options)
    }
}

export class DbForeignKeyConstraintViolationError extends DbError {
    constructor(message : string , options? : {payload : ApiFailurePayload}){
	super(message , 401 , options)
    }
}

export class DbKeyNotFoundError extends DbError {
    constructor(message : string , options? : {payload : ApiFailurePayload}){
	super(message , 404 , options)
    }
}

export function mapPrismaError(err: PrismaClientKnownRequestError): AppError {

  const type = dbErrorHash[err.code] as dbErrorType | undefined;
  let options : {payload : ApiFailurePayload} = {
      payload : {
	  success  :false,
	  err : {
	      name : "",
	      message : ""
	  }
      }
  }
  switch (type) {
    case 'UniqueConstraintViolation':
      options.payload.err.name = "Conflict Exists"
      options.payload.err.message = "Duplicate values can't be pushed"
      return new DbUniqueConstraintViolationError('Conflict' , options);
    case 'ForeignKeyConstraintViolation':
      options.payload.err.name = "Unaunthenticated access"
      options.payload.err.message = "You are not authenticated"
      return new DbForeignKeyConstraintViolationError('Unauthorized' , options);
    case "KeyNotFoundError":
      options.payload.err.name = "Not found"
      options.payload.err.message = "Key not found"
	return new DbKeyNotFoundError('Not found', options);
    default:
      return new AppError(`Unhandled database error (${err.code})`, 500, 'DatabaseError');
  }
}

