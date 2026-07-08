import { useState, useRef, useEffect } from "react";
import {
  UserCircle2,
  Camera,
  FolderOpen,
  CheckCircle2,
  Loader2,
  ImageIcon,
  Info,
  X,
  ZoomIn,
} from "lucide-react";
import type { eventType } from "../types/eventType";

type FindMeState = "idle" | "uploaded" | "searching" | "results";

interface FoundPhoto {
  id: number;
  placeholder: string; // in real app: image URL
}

interface FindMeTabProps {
  event: eventType;
}

export default function FindMeTab({ event }: FindMeTabProps) {
  const [state, setState] = useState<FindMeState>("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [foundPhotos, setFoundPhotos] = useState<FoundPhoto[]>([]);

  // Camera modal state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const photoCount = Math.max(0, event.photoCount ?? 0);

  // ── Handlers ──────────────────────────────────────────

  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setState("uploaded");
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleTakeSelfie = async () => {
    setCameraError(null);
    setCameraReady(false);
    setCameraOpen(true);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
        };
      }
    } catch {
      setCameraError("Could not access camera. Please allow camera permission and try again.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraReady(false);
  };

  const handleClosCamera = () => {
    stopCamera();
    setCameraOpen(false);
    setCameraError(null);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror horizontally (selfie feel)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
      handleFileSelected(file);
      handleClosCamera();
    }, "image/jpeg", 0.92);
  };

  // Start stream when modal opens
  useEffect(() => {
    if (cameraOpen) {
      startCamera();
    }
    return () => {
      if (!cameraOpen) stopCamera();
    };
  }, [cameraOpen]);

  const handleChange = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setFoundPhotos([]);
    setState("idle");
  };

  const handleFindPhotos = async () => {
    setState("searching");

    // TODO: replace with real face-search API call
    await new Promise((r) => setTimeout(r, 2000));

    // Mock: 3 matched photos
    setFoundPhotos([
      { id: 1, placeholder: "bg-[#3A7D44]" },
      { id: 2, placeholder: "bg-[#3A5F7D]" },
      { id: 3, placeholder: "bg-[#7D3A5F]" },
    ]);
    setState("results");
  };

  // ── Render ────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file);
          // reset so same file can be re-selected
          e.target.value = "";
        }}
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Camera Modal ── */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4 bg-[#1C1C1E] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Camera size={18} className="text-[#F97316]" />
                Take a selfie
              </div>
              <button
                onClick={handleClosCamera}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Video preview */}
            <div className="relative bg-black aspect-[4/3] flex items-center justify-center">
              {cameraError ? (
                <div className="flex flex-col items-center gap-3 px-8 text-center">
                  <Camera size={40} className="text-white/20" />
                  <p className="text-white/60 text-sm">{cameraError}</p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  {/* Face guide overlay */}
                  {cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-60 rounded-full border-2 border-white/30 border-dashed" />
                    </div>
                  )}
                  {!cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Loader2 size={32} className="text-white animate-spin" />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 px-5 py-5">
              {cameraError ? (
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F97316] text-white text-sm font-semibold hover:opacity-90 transition"
                >
                  <Camera size={16} />
                  Retry
                </button>
              ) : (
                <button
                  onClick={handleCapture}
                  disabled={!cameraReady}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center
                    hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                >
                  <ZoomIn size={24} className="text-black" />
                </button>
              )}
            </div>

            <p className="text-center text-white/30 text-xs pb-4">
              Position your face in the oval and tap the button
            </p>
          </div>
        </div>
      )}

      {/* ── Step 1: Upload ── */}
      <div className="mb-6">
        {/* Step badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5
            ${
              state !== "idle"
                ? "bg-[#14532D]/60 text-emerald-400 border border-emerald-500/30"
                : "bg-[#2C2C2E] text-white/80 border border-white/10"
            }`}
        >
          {state !== "idle" ? (
            <>
              <CheckCircle2 size={15} className="text-emerald-400" />
              Photo uploaded
            </>
          ) : (
            <>
              <span className="w-5 h-5 rounded-full bg-[#F97316] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              Upload a photo of yourself
            </>
          )}
        </div>

        {/* Upload area — idle */}
        {state === "idle" && (
          <div
            className="border-2 border-dashed border-white/15 rounded-2xl p-12
              flex flex-col items-center text-center gap-5"
          >
            <UserCircle2 size={52} className="text-white/25" />

            <div>
              <p className="text-white font-semibold text-base mb-1">
                Upload a photo of yourself
              </p>
              <p className="text-white/40 text-sm max-w-sm">
                Use a clear, front-facing photo — the more clearly your face is
                visible, the better the results.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={handleChoosePhoto}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-[#2C2C2E] border border-white/15 text-white text-sm
                  hover:border-white/30 transition"
              >
                <FolderOpen size={16} />
                Choose photo
              </button>

              <button
                onClick={handleTakeSelfie}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                  bg-[#2C2C2E] border border-white/15 text-white text-sm
                  hover:border-white/30 transition"
              >
                <Camera size={16} />
                Take selfie
              </button>
            </div>
          </div>
        )}

        {/* Uploaded preview card */}
        {(state === "uploaded" ||
          state === "searching" ||
          state === "results") && (
          <div
            className="flex items-center gap-4 bg-emerald-950/30 border border-emerald-500/20
              rounded-2xl px-5 py-4"
          >
            {/* Avatar / preview */}
            <div
              className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center
                overflow-hidden shrink-0"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Your photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle2 size={24} className="text-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {uploadedFile?.name ?? "photo.jpg"}
              </p>
              <p className="text-white/50 text-xs mt-0.5">
                Ready to search {photoCount.toLocaleString()} photos
              </p>
            </div>

            {state === "uploaded" && (
              <button
                onClick={handleChange}
                className="text-[#F97316] text-sm hover:opacity-80 transition shrink-0"
              >
                Change
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Step 2: Find photos ── */}
      {(state === "uploaded" || state === "searching") && (
        <div>
          {/* Step badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#2C2C2E] border border-white/10 text-white/80 mb-5">
            <span className="w-5 h-5 rounded-full bg-[#F97316] text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            Find my photos
          </div>

          <button
            onClick={handleFindPhotos}
            disabled={state === "searching"}
            className="w-full flex items-center justify-center gap-2
              py-3.5 rounded-2xl bg-[#2C2C2E] border border-white/10
              text-white font-semibold text-sm
              hover:border-white/25 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {state === "searching" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Scanning {photoCount.toLocaleString()} photos…
              </>
            ) : (
              "Find my photos in this event"
            )}
          </button>

          <p className="flex items-start gap-2 text-white/30 text-xs mt-3">
            <Info size={13} className="mt-0.5 shrink-0" />
            We scan all {photoCount.toLocaleString()} photos in this event and
            show you only the ones you appear in.
          </p>
        </div>
      )}

      {/* ── Results ── */}
      {state === "results" && (
        <div className="mt-2">
          <p className="text-white/50 text-sm mb-5 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400" />
            You appear in{" "}
            <span className="text-white font-semibold">
              {foundPhotos.length} photos
            </span>{" "}
            in this event
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {foundPhotos.map((photo) => (
              <button
                key={photo.id}
                className={`aspect-square ${photo.placeholder} rounded-2xl
                  flex items-center justify-center border border-white/10
                  hover:border-white/30 transition focus:outline-none
                  focus:ring-2 focus:ring-[#F97316]/60`}
              >
                <ImageIcon size={28} className="text-white/40" />
              </button>
            ))}
          </div>

          <button
            onClick={handleChange}
            className="mt-6 text-[#F97316] text-sm hover:opacity-80 transition"
          >
            Search with a different photo
          </button>
        </div>
      )}

      {/* Privacy notice — always shown in idle */}
      {state === "idle" && (
        <p className="flex items-start gap-2 text-white/25 text-xs mt-5">
          <Info size={13} className="mt-0.5 shrink-0" />
          Your photo is only used to find your pictures. It is not stored or
          shared with anyone.
        </p>
      )}
    </div>
  );
}