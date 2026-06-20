
export interface UploadEventPhotosPayload {
  eventId: string;
  ownerId: string;
  // Google Drive file ids only — backend resolves these via Drive's API.
  driveFileIds: string[];
}

export async function uploadEventPhotos(
  payload: UploadEventPhotosPayload
): Promise<void> {
  console.log("uploadEventPhotos called with:", payload);

  await new Promise((r) => setTimeout(r, 1500));
}
