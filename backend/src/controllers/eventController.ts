import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from '../config/prismaClientConfig';
import type { Request, Response } from 'express';
import dbErrorHash from '../utils/dbErrorHash';
import type { dbErrorType } from '../utils/dbErrorHash';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/Error';
import { updateEventSchema } from '../validations/event.validation';
import { getSession } from '../utils/getSessions';
import { validateSchema } from '../utils/validateSchema';
import { validateData } from '../utils/validateSyncSchema';
import { createEventSchema , deleteEventSchema , getEventSchema } from '../validations/eventSync.validation';
import type { CreateEventPayload , DeleteEventPayload , GetEventPayload } from '../validations/eventSync.validation';
import { eventSchema } from '../validations/upload.validation';
import { isParticipant} from '../utils/isParticipant';
import { redis } from '../config/redisConfig';
import { mapPrismaError, ZodValidationError } from '../errors/dbError';

type postRequestPayloadType = {
  eventName: string;
  ownerId: string;
};
type updateRequestPayloadType = {
  eventId: string;
  eventName?: string;
  thumbNailId?: string;
};

type getRequestPaylaodType = {
  ownerId: string;
};

type deleteRequestPayloadType = {
  ownerId: string;
  eventName: string;
  eventId : string;
};

type eventType = {
  id: string;
  userId: string;
  eventName: string;
  createdAt: Date;
  updatedAt: Date;
};

const createEventHandler = async (req: Request, res: Response) => {
    
  try {
    let { eventName, ownerId } = validateData(createEventSchema , req.body , res) as CreateEventPayload 

    let event: eventType | null = null;

    try {
      event = await prisma.$transaction(async (tx) => {
        const newEvent = await tx.event.create({
          data: { userId: ownerId, eventName },
        });

        await tx.participant.create({
          data: { eventId: newEvent.id, userId: ownerId },
        });

        return newEvent;
      });
    const cacheKey = `participation-${ownerId}-${event.id}`
    await redis.set( cacheKey, "1"   , 'EX' ,  600 )    
      
    } catch (dbError: unknown) {
      if (dbError instanceof PrismaClientKnownRequestError) {
	  throw mapPrismaError(dbError) 
      }
      else throw new AppError("Error")
    }

    return res.status(200).json({
      success: true,
      data: { ...event, numberOfImages: 0 },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
	if(err instanceof ZodValidationError){
	    return res.status(err.status).json(err.options)
	}
      return res.status(500).json({
        success: false,
        err: {
          name: err.name,
          message: err.message,
        },
      });
    }
  }
};

const getEventHandler = async (req: Request, res: Response) => {
  try {
      // let's make it so that other users can't see someone else's events 
    let { ownerId} = validateData(getEventSchema , req.query  , res) as GetEventPayload 
    const {validatedUserId} = req
    if(validatedUserId !== ownerId){
	return res.status(403).json({
	    success : false,
	    err: {
		name : 'Unauthorized action intended',
		message :  "You can't get someone elses events"
	    }
	})
    }

    let events: eventType[] = [];
    try {
      events = await prisma.event.findMany({
        where: {
          OR: [
            { userId: ownerId },
            {
              participant: {
                some: {
                  userId: ownerId,
                },
              },
            },
          ],
        },
        select: {
          id: true,
          userId: true,
          eventName: true,
          createdAt: true,
          updatedAt: true,
          photoCount: true,
          thumbnail: {
            select: {
              id: true,
              photo_url: true,
              width: true,
              height: true,
            },
          },
        },
      });
    } catch (dbError: unknown) {
      if (dbError instanceof PrismaClientKnownRequestError) {
        const dbErrorCode = dbError.code;
        const dbErrorName: dbErrorType = dbErrorHash[dbErrorCode] as dbErrorType;
        if (dbErrorName === 'ForeignKeyConstraintViolation') {
          return res.status(401).json({
            success: false,
            err: {
              name: "Owner doesn't exist",
              message:
                'The account has been either deleted by the user or as per community guideline',
            },
          });
        } else throw dbError;
      } else throw dbError;
    }

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
	if(err instanceof ZodValidationError){
	    return res.status(err.status).json(err.options)
	}
      return res.status(500).json({
        success: false,
        err: {
          name: err.name,
          message: err.message,
        },
      });
    }
  }
};
const getEventById = asyncHandler(async (req: Request, res: Response) => {
  const session = await getSession(req.headers as HeadersInit);
  if (!session) throw new UnauthorizedError();
  const {validatedUserId} = req
  const { eventId } = validateSchema(eventSchema, req.params);
  const hasParticipated = await isParticipant(eventId , validatedUserId)
  
  if(!hasParticipated) {
      throw new ForbiddenError("Event")
  }
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      userId: true,
      eventName: true,
      createdAt: true,
      photoCount: true,
      thumbnail: {
        select: {
          id: true,
          photo_url: true,
          width: true,
          height: true,
        },
      },
      participant : {
	  select:{
	      userId: true
	  }
      }
    },
  });
  res.status(200).json({
    success: true,
    data: event,
  });
});

const updateEventHandler = asyncHandler(async(req : Request , res : Response) => {
    const {validatedUserId} = req
  const { eventId, eventName, thumbNailId } = validateSchema(updateEventSchema, req.body);

  try {
      const participated = await isParticipant(eventId , validatedUserId)
      if(!participated) throw new ForbiddenError("Forbidden")
    const data = await prisma.event.update({
      where: { id: eventId, userId: validatedUserId },
      data: {
        ...(eventName !== undefined && { eventName }),
        ...(thumbNailId !== undefined && { thumbnailId: thumbNailId }),
      },
      select :{
	 id : true,
	 userId : true,
	 eventName : true,
	 createdAt  :true,
	 updatedAt : true,
	 photoCount : true,
	 thumbnail : {
	     select : {
		id : true,
		photo_url : true,
		width : true,
		height : true
	     }
	 }
      }
    });
    if(!!thumbNailId){
	console.log("Setting up the thumbnail Cache")
	const cacheKey = `thumbnail-${eventId}`
	await redis.set(cacheKey , thumbNailId as string , 'EX' , 600)
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new NotFoundError(`Event with id ${eventId} not found`);
    }
    throw err;
  }

});


const deleteEventHandler = async (req: Request, res: Response) => {
  try {
    const {validatedUserId} = req
    let { ownerId, eventName , eventId} = validateData(deleteEventSchema , req.body , res) as DeleteEventPayload
    if(validatedUserId !== ownerId){
	return res.status(403).json({
	    success : false,
	    err: {
		name : 'Unauthorized action intended',
		message :  "You can't get someone elses events"
	    }
	})
    }
    try {
      await prisma.event.delete({
        where: {
          eventName_userId: {
            userId: ownerId,
            eventName: eventName,
          },
        },
      });

      return res.status(200).json({
        success: true,
      });
    } catch (dbError: unknown) {
      if (dbError instanceof PrismaClientKnownRequestError) {
        const dbErrorCode = dbError.code;
        const dbErrorName: dbErrorType = dbErrorHash[dbErrorCode] as dbErrorType;
        if (dbErrorName === 'KeyNotFoundError') {
          return res.status(404).json({
            success: false,
            err: {
              name: `Couldn't find ${eventName}`,
              message: `You have never created a event named ${eventName}`,
            },
          });
        } else throw dbError;
      } else throw dbError;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
	if(err instanceof ZodValidationError){
	    return res.status(err.status).json(err.options)
	}
      console.log(err.name);
      console.log(err.stack);
      console.log(err.message);
      return res.status(500).json({
        success: false,
        err: {
          name: err.name,
          message: err.message,
        },
      });
    }
  }
};

export {
  createEventHandler,
  getEventById,
  getEventHandler,
  updateEventHandler,
  deleteEventHandler,
};
