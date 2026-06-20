import { ImageIcon } from 'lucide-react';
import type { eventType } from '../types/eventType';
import { useQuery } from '@tanstack/react-query';
import { photo } from '../api/photoApi';

interface AllPhotosTabProps {
  event: eventType;
}

export default function AllPhotosTab({ event }: AllPhotosTabProps) {
  console.log({ event });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['photos', event.id],
    queryFn: () => photo.getPhotos(event.id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  console.log(data);
  if (!data) return null;

  if (data.length === 0) {
    return (
      <div className="text-center py-24">
        <ImageIcon size={48} className="mx-auto text-white/20 mb-4" />
        <h2 className="text-xl font-semibold text-white">No photos yet</h2>
        <p className="text-white/40 mt-2 text-sm">Upload photos to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.map((photo) => (
          <button
            key={photo.id}
            className="group aspect-square bg-[#2C2C2E] rounded-2xl border border-white/10
            hover:border-white/30 transition overflow-hidden flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-[#F97316]/60"
          >
            <img src={photo.photo_url} alt="Event photo" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

