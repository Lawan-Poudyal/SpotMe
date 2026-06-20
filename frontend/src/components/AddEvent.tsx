import { useEffect, useRef, useState } from "react";
import {
  X,
  ArrowLeft,
  UploadCloud,
  Loader2,
} from "lucide-react";
import type { eventType } from "../types/eventType";

type AddEventProps = {
  open: boolean;
  onClose: () => void;
  events: eventType[];
  setEvents: (events: eventType[]) => void;
  setTitleError: (title: string) => void;
  setSubTitleError: (sub: string) => void;
  setIsErrorOpen: (open: boolean) => void;
  userId: string;
};

export default function AddEvent({
  open,
  onClose,
  events,
  setEvents,
  setTitleError,
  setSubTitleError,
  setIsErrorOpen,
}: AddEventProps) {
  const [eventName, setEventName] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ All hooks must be above any early return
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // Reset form whenever the modal opens
  useEffect(() => {
    if (open) {
      setEventName("");
      setCoverPreview(null);
      setCoverFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  // ✅ Early return AFTER all hooks
  if (!open) return null;

  const validateImage = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      setTitleError("Invalid file");
      setSubTitleError("Please upload an image file.");
      setIsErrorOpen(true);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setTitleError("File too large");
      setSubTitleError("Image must be under 5MB.");
      setIsErrorOpen(true);
      return false;
    }
    return true;
  };

  const loadPreview = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateImage(file)) return;
    loadPreview(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !validateImage(file)) return;
    loadPreview(file);
  };

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverPreview(null);
    setCoverFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreate = async () => {
    const trimmed = eventName.trim();

    if (!trimmed) {
      setTitleError("Event name required");
      setSubTitleError("Please enter a name for your event.");
      setIsErrorOpen(true);
      return;
    }

    const duplicate = events.some(
      (e) => e.eventName.toLowerCase() === trimmed.toLowerCase()
    );

    if (duplicate) {
      setTitleError("Duplicate event");
      setSubTitleError("An event with this name already exists.");
      setIsErrorOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const newEvent: eventType = {
        id: crypto.randomUUID(),
        eventName: trimmed,
        createdAt: new Date(),
        numberOfImages: 0,
      };

      setEvents([...events, newEvent]);
      onClose();
    } catch {
      setTitleError("Something went wrong");
      setSubTitleError("Failed to create event. Please try again.");
      setIsErrorOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal area */}
      <div className="relative flex-1 flex items-start justify-center overflow-y-auto">
        <div className="mt-10 w-full max-w-3xl px-6 lg:px-10 pb-10">

          {/* Back */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Create Event</h1>
            <p className="text-white/50 text-sm mt-2">
              Add event details and upload a cover image
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#2C2C2E] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col gap-6">

            {/* Event name */}
            <div>
              <label className="text-white/70 text-sm font-medium">
                Event Name
              </label>
              <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) handleCreate();
                }}
                placeholder="e.g. KU Annual Fest 2026"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-[#1C1C1E] text-white
                  border border-white/10 placeholder-white/25
                  focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            {/* Cover image */}
            <div>
              <label className="text-white/70 text-sm font-medium">
                Cover Photo
              </label>

              {coverPreview ? (
                <div className="relative mt-3 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={coverPreview}
                    alt="Event cover preview"
                    className="w-full h-56 object-cover"
                  />
                  <button
                    onClick={handleRemoveCover}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black p-2 rounded-full transition"
                    aria-label="Remove cover image"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`mt-3 border-2 border-dashed rounded-xl h-48 flex flex-col
                    items-center justify-center cursor-pointer transition-all select-none
                    ${
                      isDragging
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-white/15 hover:border-white/30 hover:bg-white/[0.02]"
                    }`}
                >
                  <UploadCloud className="text-white/40 mb-2" size={26} />
                  <p className="text-white/50 text-sm">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-white/30 text-xs mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white
                hover:bg-white/5 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600
                text-white font-semibold transition disabled:opacity-60
                flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating…
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}