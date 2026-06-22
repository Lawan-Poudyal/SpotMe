import { useState, useRef, useCallback, type Dispatch, type SetStateAction } from "react";
import {
  UploadCloud,
  X,
  CheckCircle2,
  Loader2,
  Info,
  HardDrive,
} from "lucide-react";
import type { eventType } from "../types/eventType";
import { getAccessToken } from "../api/googleDriveRequestApi";
import type { zuContextType } from "../context/zuContext";
import { useProfile } from "../context/zuContext";
import { requestDriveScope } from "../api/linkSocialMedia";
import { useParams } from "react-router-dom";
import PopUpBox from "../components/PopupBox";
import { uploadEventPhotos } from "../api/eventPhotoUploadApi";
import { useMutation } from "@tanstack/react-query";
import { fileUploads } from "../api/fileUploadApi";
import { queryClient } from "../config/tanstack";

interface UploadFile {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  source: "local" | "drive";
  driveFileId?: string;
}

interface UploadTabProps {
  event: eventType;
}

async function openGoogleDrivePicker(
  ownerId: string,
  event: string,
  setErrorTitle: Dispatch<SetStateAction<string>>,
  setSubErrorTitle: Dispatch<SetStateAction<string>>,
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>,
): Promise<{ id: string; name: string; mimeType: string; url: string; sizeBytes?: number }[]> {
  await new Promise<void>((resolve, reject) => {
    if (window.gapi) return resolve();
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });

  await new Promise<void>((resolve) => window.gapi.load("picker", resolve));

  const responseObj = await getAccessToken(ownerId);

  if (responseObj?.success === false) {
    await requestDriveScope(event, setErrorTitle, setSubErrorTitle, setIsErrorOpen);
    return [];
  }

  const accessToken = responseObj?.accessToken;

  return new Promise((resolve) => {
      const picker = new window.google.picker.PickerBuilder()
  .addView(new window.google.picker.View(window.google.picker.ViewId.DOCS_IMAGES))
  .setOAuthToken(accessToken)
  .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY as string)
  .setAppId("1090789030635")
  .setSelectableMimeTypes("image/jpeg,image/png,image/webp,image/heic,image/gif")
  .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
  .setCallback((data) => {
    console.log('callback fired:', data.action, data.docs);
    if (data.action === window.google.picker.Action.PICKED) {
      resolve(data.docs ?? []);
    } else if (data.action === window.google.picker.Action.CANCEL) {
      resolve([]);
    }
  })
  .build();
    picker.setVisible(true);
  });
}

export default function UploadTab({ event }: UploadTabProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const eventId = useParams().eventId;
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const userId = useProfile((s: zuContextType) => s.id);
  const [errorTitle, setErrorTitle] = useState<string>("");
  const [subErrorTitle, setSubErrorTitle] = useState<string>("");
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ─────────────────────────────────────

  const addFiles = (incoming: FileList | File[]) => {
    const imageFiles = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    const mapped: UploadFile[] = imageFiles.map((f) => ({
      id: `${f.name}-${f.lastModified}-${Math.random()}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: "pending",
      progress: 0,
      source: "local",
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const addDriveFiles = (
    driveFiles: { id: string; name: string; mimeType: string; url: string; sizeBytes?: number }[],
  ) => {
    const mapped: UploadFile[] = driveFiles.map((df) => ({
      id: `drive-${df.id}-${Math.random()}`,
      file: new File([], df.name, { type: df.mimeType }),
      previewUrl: `https://drive.google.com/thumbnail?id=${df.id}&sz=w128`,
      status: "pending",
      progress: 0,
      source: "drive",
      driveFileId: df.id,
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target && target.source === "local") URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  // ── Drag & drop ───────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // ── Google Drive ──────────────────────────────────────

  const handleGoogleDrive = async () => {
    if (isDriveLoading || isUploading) return;
    setIsDriveLoading(true);
    try {
      const picked = await openGoogleDrivePicker(
        userId,
        String(eventId),
        setErrorTitle,
        setSubErrorTitle,
        setIsErrorOpen,
      );
      if (picked.length > 0) addDriveFiles(picked);
    } catch (err) {
      console.error("Google Drive picker error:", err);
    } finally {
      setIsDriveLoading(false);
    }
  };

  // ── Upload (local → Cloudinary, drive → uploadEventPhotos) ───────────────

  const uploadSignatureMutation = useMutation({
    mutationFn: () => fileUploads.signRequest(eventId),
  });

  const saveUploadMutation = useMutation({
    mutationFn: (photos: { url: string; publicId: string; width: number; height: number }[]) =>
      fileUploads.saveUpload(eventId, photos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos", eventId] });
    },
  });

  const setFileStatus = (
    ids: string[],
    status: UploadFile["status"],
    progress?: number,
  ) => {
    setFiles((prev) =>
      prev.map((f) =>
        ids.includes(f.id)
          ? { ...f, status, progress: progress ?? f.progress }
          : f,
      ),
    );
  };

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;
    setIsUploading(true);

    const localFiles = files.filter((f) => f.source === "local");
    const driveFiles = files.filter((f) => f.source === "drive");

    // Mark all as uploading
    setFiles((prev) =>
      prev.map((f) => ({ ...f, status: "uploading" as const, progress: 10 })),
    );

    // ── Local files → Cloudinary ──────────────────────────
    if (localFiles.length > 0) {
      try {
        const sig = await uploadSignatureMutation.mutateAsync();

        const uploads = localFiles.map((f) => {
          const formData = new FormData();
          formData.append("file", f.file);
          formData.append("api_key", sig.apiKey);
          formData.append("timestamp", sig.timestamp.toString());
          formData.append("signature", sig.signature);
          formData.append("folder", sig.folder);
          return fileUploads.uploadFile(formData, sig.cloudName).then((res) => ({ f, res }));
        });

        // Tick progress to 60 once uploads are in flight
        setFileStatus(localFiles.map((f) => f.id), "uploading", 60);

        const results = await Promise.allSettled(uploads);

        const succeeded = results
          .filter((r): r is PromiseFulfilledResult<{ f: UploadFile; res: any }> => r.status === "fulfilled")
          .map((r) => r.value);

        const failedIds = results
          .map((r, i) => (r.status === "rejected" ? localFiles[i].id : null))
          .filter((id): id is string => id !== null);

        if (succeeded.length > 0) {
          await saveUploadMutation.mutateAsync(
            succeeded.map(({ res }) => ({
              url: res.secure_url,
              publicId: res.public_id,
              width: res.width,
              height: res.height,
            })),
          );
          setFileStatus(succeeded.map(({ f }) => f.id), "done", 100);
        }

        if (failedIds.length > 0) {
          setFileStatus(failedIds, "error");
        }
      } catch {
        setFileStatus(localFiles.map((f) => f.id), "error");
      }
    }

    // ── Drive files → uploadEventPhotos ───────────────────
    if (driveFiles.length > 0) {
      const driveSuccess = await uploadEventPhotos({
        eventId: String(eventId),
        ownerId: String(userId),
        driveFileIds: driveFiles
          .map((f) => f.driveFileId)
          .filter((id): id is string => Boolean(id)),
        setIsUploading: () => {}, // outer flag already set
        setErrorTitle,
        setSubErrorTitle,
        setIsErrorOpen,
      });
      if (driveSuccess) {
	queryClient.invalidateQueries({ queryKey: ['photos', eventId] });
    }

      setFiles((prev) =>
        prev.map((f) =>
          f.source === "drive"
            ? {
                ...f,
                status: driveSuccess ? ("done" as const) : ("error" as const),
                progress: driveSuccess ? 100 : f.progress,
              }
            : f,
        ),
      );
    }

    // Remove successfully uploaded files, keep only failed ones for retry
    setFiles((prev) => prev.filter((f) => f.status !== "done"));
    setIsUploading(false);
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const failedCount = files.filter((f) => f.status === "error").length;

  // ── Render ────────────────────────────────────────────

  return (
    <>
      <PopUpBox title={errorTitle} subTitle={subErrorTitle} open={isErrorOpen} setOpen={setIsErrorOpen} />
      <div className="max-w-2xl mx-auto">
        {/* Hidden local input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center
            text-center gap-4 cursor-pointer transition select-none
            ${
              isDragging
                ? "border-[#F97316]/60 bg-[#F97316]/5"
                : "border-white/15 hover:border-white/25"
            }`}
        >
          <UploadCloud size={48} className={isDragging ? "text-[#F97316]" : "text-white/25"} />
          <div>
            <p className="text-white font-semibold text-base mb-1">
              {isDragging ? "Drop photos here" : "Drag & drop photos here"}
            </p>
            <p className="text-white/40 text-sm">
              or{" "}
              <span className="text-[#F97316] underline underline-offset-2">browse files</span> —
              JPG, PNG, HEIC, WEBP
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/25 text-xs font-medium tracking-wide uppercase">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google Drive button */}
        <button
          onClick={handleGoogleDrive}
          disabled={isDriveLoading || isUploading}
          className="w-full flex items-center justify-center gap-3
            border border-white/10 bg-[#2C2C2E] hover:bg-[#3A3A3C]
            disabled:opacity-50 disabled:cursor-not-allowed
            rounded-2xl py-3.5 transition"
        >
          {isDriveLoading ? (
            <Loader2 size={18} className="animate-spin text-white/50" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L28.5 49H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
              <path d="M43.65 25L29.4 0c-1.35.8-2.5 1.9-3.3 3.3L1.2 44.5A9.06 9.06 0 000 49h28.5z" fill="#00ac47" />
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 53.5c.8-1.4 1.2-2.95 1.2-4.5H58.8L73.55 76.8z" fill="#ea4335" />
              <path d="M43.65 25L58.5 0H29.4z" fill="#00832d" />
              <path d="M58.8 49H87.3L73.55 76.8 58.8 49z" fill="#2684fc" />
              <path d="M58.8 49L43.65 25 28.5 49z" fill="#ffba00" />
            </svg>
          )}
          <span className="text-white/80 text-sm font-medium">
            {isDriveLoading ? "Opening Google Drive…" : "Import from Google Drive"}
          </span>
        </button>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-white/50 text-sm">
              {files.length} photo{files.length !== 1 ? "s" : ""} selected
            </p>

            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-4 bg-[#2C2C2E] border border-white/10 rounded-2xl px-4 py-3"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#1C1C1E]">
                  <img src={f.previewUrl} alt={f.file.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{f.file.name}</p>
                    {f.source === "drive" && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium
                        text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-1.5 py-0.5">
                        <HardDrive size={9} />
                        Drive
                      </span>
                    )}
                  </div>

                  {f.source === "local" && (
                    <p className="text-white/35 text-xs mt-0.5">
                      {(f.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                  {f.source === "drive" && f.status === "pending" && (
                    <p className="text-white/35 text-xs mt-0.5">From Google Drive</p>
                  )}

                  {/* Progress bar */}
                  {f.status === "uploading" && (
                    <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#F97316] rounded-full transition-all duration-200"
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Status / remove */}
                <div className="shrink-0">
                  {f.status === "done" ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : f.status === "uploading" ? (
                    <Loader2 size={18} className="animate-spin text-[#F97316]" />
                  ) : f.status === "error" ? (
                    <span className="text-red-400 text-xs font-medium">Failed</span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(f.id);
                      }}
                      className="text-white/30 hover:text-white/70 transition"
                      aria-label="Remove"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        {files.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={isUploading || pendingCount === 0}
            className="mt-6 w-full flex items-center justify-center gap-2
              py-3.5 rounded-2xl bg-[#F97316] hover:opacity-90
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold text-sm transition"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <UploadCloud size={16} />
                Upload {pendingCount} photo{pendingCount !== 1 ? "s" : ""} to {event.eventName}
              </>
            )}
          </button>
        )}

        {/* Failed files hint */}
        {!isUploading && failedCount > 0 && (
          <p className="mt-3 text-center text-red-400/70 text-xs">
            {failedCount} photo{failedCount !== 1 ? "s" : ""} failed — remove them or try uploading again.
          </p>
        )}

        {/* Empty state hint */}
        {files.length === 0 && (
          <p className="flex items-start gap-2 text-white/25 text-xs mt-5">
            <Info size={13} className="mt-0.5 shrink-0" />
            Photos you upload will be visible to everyone in this event.
          </p>
        )}
      </div>
    </>
  );
}
