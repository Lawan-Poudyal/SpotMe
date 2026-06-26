export type eventType = {
  id: string;
  userId: string;
  eventName: string;
  createdAt?: Date;
  updatedAt?: Date;
  photoCount: number;
  thumbnail: { id: string; photo_url: string; width: number | null; height: number | null } | null;
};
