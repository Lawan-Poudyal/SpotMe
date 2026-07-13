
import type { Dispatch, SetStateAction } from "react";
import { api } from "../config/axios";

export interface UploadEventPhotosPayload {
  eventId: string;
  ownerId: string;
  accessToken : string;
  driveFileIds: string[];
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  setErrorTitle: Dispatch<SetStateAction<string>>;
  setSubErrorTitle: Dispatch<SetStateAction<string>>;
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>;
}
export interface UploadEventReferenceImagePayload {
  eventId: string;
  ownerId: string;
  accessToken : string;
  driveFileId: string;
  existingPhotoId : string;
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
    accessToken,
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

    await api.post("/api/driveUploadAPI", {
	eventId ,
	ownerId,
	accessToken,
	driveFileIds
    })

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
export async function uploadEventReferencePhoto(
  payload: UploadEventReferenceImagePayload
): Promise<boolean> {
  const {
    eventId,
    ownerId,
    accessToken,
    driveFileId,
    existingPhotoId,
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
      driveFileId,
      existingPhotoId
    });

    await api.post("/api/driveUploadAPI/referencePhoto", {
	eventId ,
	ownerId,
	accessToken,
	driveFileId,
	existingPhotoId
    })

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
