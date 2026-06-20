import { ImageIcon } from "lucide-react";
import type { eventType } from "../types/eventType";

interface AllPhotosTabProps {
  event: eventType;
}

export default function AllPhotosTab({ event }: AllPhotosTabProps) {
  const photoCount = event.numberOfImages ?? 0;

  if (photoCount === 0) {
    return (
      <div className="text-center py-24">
        <ImageIcon size={48} className="mx-auto text-white/20 mb-4" />
        <h2 className="text-xl font-semibold text-white">No photos yet</h2>
        <p className="text-white/40 mt-2 text-sm">
          Upload photos to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: Math.min(photoCount, 20) }).map((_, index) => (
          <button
            key={index}
            className="group aspect-square bg-[#2C2C2E] rounded-2xl border border-white/10
              hover:border-white/30 transition overflow-hidden flex items-center justify-center
              focus:outline-none focus:ring-2 focus:ring-[#F97316]/60"
          >
            <ImageIcon
              size={28}
              className="text-white/30 group-hover:text-white/50 transition"
            />
          </button>
        ))}
      </div>

      {photoCount > 20 && (
        <p className="text-white/30 text-sm text-center mt-8">
          Showing 20 of {photoCount.toLocaleString()} photos
        </p>
      )}
    </div>
  );
}