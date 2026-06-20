import type { Dispatch, SetStateAction } from "react";

export interface UploadEventPhotosPayload {
  eventId: string;
  ownerId: string;
  // Google Drive file ids only — backend resolves these via Drive's API.
  driveFileIds: string[];
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  setErrorTitle: Dispatch<SetStateAction<string>>;
  setSubErrorTitle: Dispatch<SetStateAction<string>>;
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>;
}

export async function uploadEventPhotos(
  payload: UploadEventPhotosPayload
): Promise<boolean> {
  const {
    eventId,
    ownerId,
    driveFileIds,
    setIsUploading,
    setErrorTitle,
    setSubErrorTitle,
    setIsErrorOpen,
  } = payload;

  setIsUploading(true);

  try {

    console.log("uploadEventPhotos called with:", {
      eventId,
      ownerId,
      driveFileIds,
    });

    await new Promise((r) => setTimeout(r, 1500));

    return true;
  } catch (err) {
    console.error("Upload failed:", err);
    setErrorTitle("Upload failed");
    setSubErrorTitle(
      "We couldn't upload your photos. Please try again."
    );
    setIsErrorOpen(true);
    return false;
  } finally {
    setIsUploading(false);
  }
}
