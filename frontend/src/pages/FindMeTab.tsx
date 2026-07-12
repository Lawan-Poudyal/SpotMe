import { useState, useRef, useEffect, type Dispatch, type SetStateAction } from "react";
import {
  UploadCloud,
  X,
  CheckCircle2,
  Loader2,
  Info,
  HardDrive,
  ScanFace,
  Camera,
} from "lucide-react";
import type { eventType } from "../types/eventType";
import { getAccessToken } from "../api/googleDriveRequestApi";
import type { zuContextType } from "../context/zuContext";
import { useProfile } from "../context/zuContext";
import { requestDriveScope } from "../api/linkSocialMedia";
import { useParams } from "react-router-dom";
import type { UploadFile, ReferencePhoto } from "./EventDetails";

interface FindMeTabProps {
  event: eventType;
  // Lifted up to EventDetails so its photo_id is available where the
  // upload calls actually happen — this tab just displays it now.
  existingReferencePhoto: ReferencePhoto | undefined;
  isExistingReferenceLoading: boolean;
  referenceFile: UploadFile | null;
  isReferenceUploading: boolean;
  referenceAccessToken: string;
  setReferenceAccessToken: Dispatch<SetStateAction<string>>;
  addReferenceFile: (incoming: FileList | File[]) => void;
  addReferenceDriveFile: (driveFile: {
    id: string;
    name: string;
    mimeType: string;
    url: string;
    sizeBytes?: number;
    thumbnailUrl?: string;
  }) => void;
  removeReferenceFile: () => void;
  handleReferenceUpload: () => Promise<void>;
  setErrorTitle: Dispatch<SetStateAction<string>>;
  setSubErrorTitle: Dispatch<SetStateAction<string>>;
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>;
}

// Same picker as the gallery upload, but single-select — this tab only
// ever stages one reference photo at a time.
async function openGoogleDrivePickerSingle(
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
      // no MULTISELECT_ENABLED — only one reference photo is ever staged
      .setCallback((data) => {
        if (data.action === window.google.picker.Action.PICKED) {
          resolve({ data: data.docs ?? [], accessToken });
        } else if (data.action === window.google.picker.Action.CANCEL) {
          resolve({ data: [], accessToken });
        }
      })
      .build();
    picker.setVisible(true);
  });
}

export default function FindMeTab({
  event,
  existingReferencePhoto,
  isExistingReferenceLoading,
  referenceFile,
  isReferenceUploading,
  referenceAccessToken,
  setReferenceAccessToken,
  addReferenceFile,
  addReferenceDriveFile,
  removeReferenceFile,
  handleReferenceUpload,
  setErrorTitle,
  setSubErrorTitle,
  setIsErrorOpen,
}: FindMeTabProps) {
  const eventId = useParams().eventId;
  const [isDragging, setIsDragging] = useState(false);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const userId = useProfile((s: zuContextType) => s.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Camera capture ────────────────────────────────────
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── Drag & drop ───────────────────────────────────────

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addReferenceFile(e.dataTransfer.files);
  };

  // ── Camera ────────────────────────────────────────────

  const stopCameraStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const openCamera = async () => {
    if (isReferenceUploading) return;
    setCameraError("");
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Couldn't access your camera. Check permissions and try again.");
    }
  };

  const closeCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCameraError("");
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        addReferenceFile([file]);
        closeCamera();
      },
      "image/jpeg",
      0.92,
    );
  };

  // Stop the stream if the component unmounts while the camera is open
  useEffect(() => stopCameraStream, []);

  // ── Google Drive ──────────────────────────────────────

  const handleGoogleDrive = async () => {
    if (isDriveLoading || isReferenceUploading) return;
    setIsDriveLoading(true);
    try {
      const { data: picked, accessToken: newAccessToken } = await openGoogleDrivePickerSingle(
        userId,
        String(eventId),
        setErrorTitle,
        setSubErrorTitle,
        setIsErrorOpen,
      );
      if (picked.length > 0) addReferenceDriveFile(picked[0]);
      setReferenceAccessToken(newAccessToken);
    } catch (err) {
      console.error("Google Drive picker error:", err);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const isPending = referenceFile?.status === "pending";
  const hasFailed = referenceFile?.status === "error";

  // ── Render ────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hidden local input — single file only */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addReferenceFile(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Previously uploaded reference photo */}
      <div className="mb-6 bg-[#2C2C2E] border border-white/10 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <ScanFace size={14} className="text-white/40" />
          <p className="text-white/50 text-xs font-medium uppercase tracking-wide">
            Your reference photo
          </p>
        </div>

        {isExistingReferenceLoading ? (
          <div className="flex items-center gap-2 text-white/35 text-sm">
            <Loader2 size={14} className="animate-spin" />
            Checking for an existing photo…
          </div>
        ) : existingReferencePhoto?.photo_url ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#1C1C1E]">
              <img
                src={existingReferencePhoto.photo_url}
                alt="Your current reference"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white/50 text-sm">
              You're all set — upload a new photo below to replace it.
            </p>
          </div>
        ) : (
          <p className="text-white/35 text-sm">
            No reference photo yet — upload one below so we can find you in event photos.
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center
          text-center gap-4 cursor-pointer transition select-none
          ${isDragging
            ? "border-[#F97316]/60 bg-[#F97316]/5"
            : "border-white/15 hover:border-white/25"
          }`}
      >
        <UploadCloud size={48} className={isDragging ? "text-[#F97316]" : "text-white/25"} />
        <div>
          <p className="text-white font-semibold text-base mb-1">
            {isDragging ? "Drop your photo here" : "Drag & drop your photo here"}
          </p>
          <p className="text-white/40 text-sm">
            or{" "}
            <span className="text-[#F97316] underline underline-offset-2">browse files</span> —
            take a full picture from head to toe, wearing what you had on at the event
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/25 text-xs font-medium tracking-wide uppercase">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Camera + Google Drive buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={openCamera}
          disabled={isReferenceUploading}
          className="flex items-center justify-center gap-2.5
            border border-white/10 bg-[#2C2C2E] hover:bg-[#3A3A3C]
            disabled:opacity-50 disabled:cursor-not-allowed
            rounded-2xl py-3.5 transition"
        >
          <Camera size={18} className="text-white/60" />
          <span className="text-white/80 text-sm font-medium">Take a selfie</span>
        </button>

        <button
          onClick={handleGoogleDrive}
          disabled={isDriveLoading || isReferenceUploading}
          className="flex items-center justify-center gap-2.5
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
            {isDriveLoading ? "Opening…" : "Google Drive"}
          </span>
        </button>
      </div>

      {/* Staged file — single slot, not a list */}
      {referenceFile && (
        <div className="mt-6 space-y-3">
          <p className="text-white/50 text-sm">1 photo selected</p>

          <div className="flex items-center gap-4 bg-[#2C2C2E] border border-white/10 rounded-2xl px-4 py-3">
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#1C1C1E]">
              <img
                src={referenceFile.previewUrl}
                alt={referenceFile.file.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="text-white text-sm font-medium truncate">{referenceFile.file.name}</p>
                {referenceFile.source === "drive" && (
                  <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium
                    text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-1.5 py-0.5">
                    <HardDrive size={9} />
                    Drive
                  </span>
                )}
              </div>

              {referenceFile.source === "local" && (
                <p className="text-white/35 text-xs mt-0.5">
                  {(referenceFile.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              )}
              {referenceFile.source === "drive" && referenceFile.status === "pending" && (
                <p className="text-white/35 text-xs mt-0.5">From Google Drive</p>
              )}
              {referenceFile.source === "drive" && referenceFile.status === "uploading" && (
                <p className="text-white/35 text-xs mt-0.5">
                  {referenceFile.progress < 40 ? "Sending to server…" : "Processing on server…"}
                </p>
              )}

              {/* Progress bar */}
              {referenceFile.status === "uploading" && (
                <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#F97316] rounded-full transition-all duration-500"
                    style={{ width: `${referenceFile.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Status / remove */}
            <div className="shrink-0">
              {referenceFile.status === "done" ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : referenceFile.status === "uploading" ? (
                <Loader2 size={18} className="animate-spin text-[#F97316]" />
              ) : referenceFile.status === "error" ? (
                <span className="text-red-400 text-xs font-medium">Failed</span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeReferenceFile();
                  }}
                  className="text-white/30 hover:text-white/70 transition"
                  aria-label="Remove"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload button */}
      {referenceFile && (
        <button
          onClick={handleReferenceUpload}
          disabled={isReferenceUploading || !isPending}
          className={`mt-6 w-full flex items-center justify-center gap-2
            py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300
            disabled:cursor-not-allowed text-white
            ${isReferenceUploading
              ? "bg-[#F97316] opacity-80 shadow-[0_0_20px_4px_rgba(249,115,22,0.45)] animate-pulse cursor-not-allowed"
              : isPending
                ? "bg-[#F97316] hover:opacity-90 shadow-[0_0_16px_2px_rgba(249,115,22,0.30)] hover:shadow-[0_0_24px_6px_rgba(249,115,22,0.50)]"
                : "bg-[#F97316] opacity-60"
            }`}
        >
          {isReferenceUploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {referenceFile.source === "drive" ? "Processing Drive photo…" : "Uploading…"}
            </>
          ) : (
            <>
              <UploadCloud size={16} />
              Upload reference photo for {event.eventName}
            </>
          )}
        </button>
      )}

      {/* Failed file hint */}
      {!isReferenceUploading && hasFailed && (
        <p className="mt-3 text-center text-red-400/70 text-xs">
          The photo failed to upload — remove it and try again.
        </p>
      )}

      {/* Empty state hint */}
      {!referenceFile && (
        <p className="flex items-start gap-2 text-white/25 text-xs mt-5">
          <Info size={13} className="mt-0.5 shrink-0" />
          Only one reference photo is kept — picking a new one replaces it.
        </p>
      )}

      {/* Camera modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <button
            onClick={closeCamera}
            className="absolute top-5 right-5 text-white/60 hover:text-white transition"
            aria-label="Close camera"
          >
            <X size={26} />
          </button>

          <div className="w-full max-w-md">
            <p className="text-center text-white font-semibold text-base mb-1">
              Take a selfie
            </p>
            <p className="text-center text-white/40 text-sm mb-4 px-4">
              Frame a full picture from head to toe, wearing what you had on at the event
            </p>

            <div className="relative rounded-2xl overflow-hidden bg-[#1C1C1E] aspect-[3/4]">
              {cameraError ? (
                <div className="w-full h-full flex items-center justify-center px-6">
                  <p className="text-red-400/80 text-sm text-center">{cameraError}</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              )}

              {/* Head-to-toe framing guide */}
              {!cameraError && (
                <div className="pointer-events-none absolute inset-4 border-2 border-dashed border-white/25 rounded-xl" />
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={closeCamera}
                className="px-5 py-3 rounded-2xl text-white/60 hover:text-white text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                disabled={!!cameraError}
                className="w-16 h-16 rounded-full bg-[#F97316] hover:opacity-90
                  disabled:opacity-40 disabled:cursor-not-allowed
                  shadow-[0_0_20px_4px_rgba(249,115,22,0.40)]
                  flex items-center justify-center transition"
                aria-label="Capture photo"
              >
                <Camera size={24} className="text-white" />
              </button>
              <div className="w-[60px]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
