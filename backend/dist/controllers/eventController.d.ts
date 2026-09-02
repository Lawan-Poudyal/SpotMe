import type { Request, Response } from 'express';
declare const createEventHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getEventHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getEventById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare const updateEventHandler: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare const deleteEventHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export { createEventHandler, getEventById, getEventHandler, updateEventHandler, deleteEventHandler, };
//# sourceMappingURL=eventController.d.ts.map