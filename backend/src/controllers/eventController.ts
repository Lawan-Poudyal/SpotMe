import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from '../config/prismaClientConfig';
import type { Request, Response } from 'express';
import dbErrorHash from '../utils/dbErrorHash';
import type { dbErrorType } from '../utils/dbErrorHash';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, UnauthorizedError, ValidationError } from '../errors/Error';
import { updateEventSchema } from '../validations/event.validation';
import { getSession } from '../utils/getSessions';

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
    let { eventName, ownerId } = req.body as postRequestPayloadType;
    if (!eventName || eventName.trim() === '') {
      return res.status(400).json({
        success: false,
        err: {
          name: 'Bad request payload',
          message: 'Missing event name in the request payload',
        },
      });
    }
    if (!ownerId || ownerId.trim() === '') {
      return res.status(400).json({
        success: false,
        err: {
          name: 'Bad request payload',
          message: 'Missing owner id in the request payload',
        },
      });
    }

    let event: eventType | null = null;

    try {
      event = await prisma.event.create({
        data: {
          userId: ownerId,
          eventName: eventName,
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
        } else if (dbErrorName === 'UniqueConstraintViolation') {
          return res.status(409).json({
            success: false,
            err: {
              name: 'Conflicting names exist',
              message: "Try using a different name which doesn't already exist in your events",
            },
          });
        } else throw dbError;
      } else throw dbError;
    }

    return res.status(200).json({
      success: true,
      data: { ...event, numberOfImages: 0 },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
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
    let { ownerId } = req.query as getRequestPaylaodType;
    if (!ownerId || ownerId.trim() === '') {
      return res.status(400).json({
        success: false,
        err: {
          name: 'Bad request payload',
          message: 'Missing owner id in the request payload',
        },
      });
    }

    let events: eventType[] = [];
    try {
      events = await prisma.event.findMany({
        where: {
          userId: ownerId,
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

const updateEventHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = updateEventSchema.safeParse(req.body);
  const session = await getSession(req.headers as HeadersInit);

  if (!session) throw new UnauthorizedError();
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.errors.forEach((err) => {
      const fieldName = err.path[0] as string;
      fieldErrors[fieldName] = err.message;
    });

    throw new ValidationError('Validation failed', fieldErrors);
  }
  const { eventId, eventName, thumbNailId } = result.data;

  try {
    const data = await prisma.event.update({
      where: { id: eventId, userId: session.user.id },
      data: {
        ...(eventName !== undefined && { eventName }),
        ...(thumbNailId !== undefined && { thumbnailId: thumbNailId }),
      },
    });
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
    let { ownerId, eventName } = req.body as deleteRequestPayloadType;
    if (!ownerId || ownerId.trim() === '') {
      // although !ownerId is enough for === "" and !ownerId both but did it to show what i intended.
      return res.status(400).json({
        success: false,
        err: {
          name: 'Bad request payload',
          message: 'Missing owner id in the request payload',
        },
      });
    }
    if (!eventName || eventName.trim() === '') {
      return res.status(400).json({
        success: false,
        err: {
          name: 'Bad request payload',
          message: 'Missing event name in the request payload',
        },
      });
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
        if (dbErrorName === 'CompositeKeyViolation') {
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

export { createEventHandler, getEventHandler, updateEventHandler, deleteEventHandler };
