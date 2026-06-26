export type eventType = {
  id: string;
  userId: string;
  eventName: string;
  createdAt?: Date;
  updatedAt?: Date;
  _count?: { photos: number };
};
