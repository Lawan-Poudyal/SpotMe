import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import type { eventType } from '../types/eventType';
import { useQuery } from '@tanstack/react-query';
import { photo } from '../api/photoApi';
import PhotoAlbum from 'react-photo-album';
import 'react-photo-album/rows.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface AllPhotosTabProps {
  event: eventType;
}

export default function AllPhotosTab({ event }: AllPhotosTabProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['photos', event.id],
    queryFn: () => photo.getPhotos(event.id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
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

  const slides = data.map((p) => ({
    src: p.photo_url,
    width: p.width ?? 800,
    height: p.height ?? 600,
  }));

  return (
    <div className="p-1">
      <PhotoAlbum
        layout="rows"
        photos={slides.map((s, i) => ({ ...s, key: data[i].id }))}
        targetRowHeight={320}
        rowConstraints={{ minPhotos: 1 }}
        spacing={6}
        onClick={({ index }) => setLightboxIndex(index)}
      />

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </div>
  );
}
