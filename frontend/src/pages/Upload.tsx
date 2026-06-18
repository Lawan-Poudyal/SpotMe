import { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  X,
  ImageIcon,
  CheckCircle2,
  Loader2,
  Info,
} from "lucide-react";
import type { eventType } from "../types/eventType";

interface UploadFile {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
}

interface UploadTabProps {
  event: eventType;
}

export default function UploadTab({ event }: UploadTabProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ──────────────────────────────────────

  const addFiles = (incoming: FileList | File[]) => {
    const imageFiles = Array.from(incoming).filter((f) =>
      f.type.startsWith("image/")
    );

    const mapped: UploadFile[] = imageFiles.map((f) => ({
      id: `${f.name}-${f.lastModified}-${Math.random()}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: "pending",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  // ── Drag & drop ───────────────────────────────────────

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // ── Upload ────────────────────────────────────────────

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;
    setIsUploading(true);

    // Mark all as uploading
    setFiles((prev) =>
      prev.map((f) => ({ ...f, status: "uploading" as const, progress: 0 }))
    );

    // TODO: replace with real upload logic — e.g. presigned S3 URLs per file
    for (const uploadFile of files) {
      // Simulate per-file progress
      for (let p = 20; p <= 100; p += 20) {
        await new Promise((r) => setTimeout(r, 180));
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: p } : f
          )
        );
      }
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "done", progress: 100 } : f
        )
      );
    }

    setIsUploading(false);
  };

  const doneCount = files.filter((f) => f.status === "done").length;
  const allDone = files.length > 0 && doneCount === files.length;

  // ── Render ────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hidden input */}
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
        <UploadCloud
          size={48}
          className={isDragging ? "text-[#F97316]" : "text-white/25"}
        />

        <div>
          <p className="text-white font-semibold text-base mb-1">
            {isDragging ? "Drop photos here" : "Drag & drop photos here"}
          </p>
          <p className="text-white/40 text-sm">
            or{" "}
            <span className="text-[#F97316] underline underline-offset-2">
              browse files
            </span>{" "}
            — JPG, PNG, HEIC, WEBP
          </p>
        </div>
      </div>

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
                <img
                  src={f.previewUrl}
                  alt={f.file.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {f.file.name}
                </p>
                <p className="text-white/35 text-xs mt-0.5">
                  {(f.file.size / 1024 / 1024).toFixed(1)} MB
                </p>

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
      {files.length > 0 && !allDone && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
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
              Upload {files.length} photo{files.length !== 1 ? "s" : ""} to{" "}
              {event.eventName}
            </>
          )}
        </button>
      )}

      {/* All done state */}
      {allDone && (
        <div
          className="mt-6 flex items-center justify-between bg-emerald-950/30
            border border-emerald-500/20 rounded-2xl px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">
                {doneCount} photo{doneCount !== 1 ? "s" : ""} uploaded
              </p>
              <p className="text-white/40 text-xs mt-0.5">
                They are now visible in {event.eventName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setFiles([])}
            className="text-[#F97316] text-sm hover:opacity-80 transition"
          >
            Upload more
          </button>
        </div>
      )}

      {/* Empty state hint */}
      {files.length === 0 && (
        <p className="flex items-start gap-2 text-white/25 text-xs mt-5">
          <Info size={13} className="mt-0.5 shrink-0" />
          Photos you upload will be visible to everyone in this event.
        </p>
      )}
    </div>
  );
}