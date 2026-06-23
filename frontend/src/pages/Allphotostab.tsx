import { useState } from 'react';
import { ImageIcon, Trash2 } from 'lucide-react';
import type { eventType } from '../types/eventType';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { photo } from '../api/photoApi';
import PhotoAlbum from 'react-photo-album';
import 'react-photo-album/rows.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface AllPhotosTabProps {
  event: eventType;
}


export default function AllPhotosTab({ event }: AllPhotosTabProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['photos', event.id],
    queryFn: () => photo.getPhotos(event.id),
  });

  const deletePhoto = useMutation({
    mutationFn: (photoId: string) => photo.deletePhoto(photoId, event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', event.id] });
      setConfirmOpen(false);
      setLightboxIndex(-1);
    },
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
  // ADD THIS PROP:
/>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        toolbar={{
          buttons: [
            <button
              key="delete"
              onClick={() => setConfirmOpen(true)}
              className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-red-400"
              title="Delete photo"
            >
              <Trash2 size={32} color="#CE1126" className="cursor-pointer" />
            </button>,
            'close',
          ],
        }}
      />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} sx={{ zIndex: 99999 }}>
        <DialogTitle>Delete Photo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this photo? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="cursor-pointer" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => {
              const photoId = data[lightboxIndex]?.id;
              if (photoId) deletePhoto.mutateAsync(photoId);
            }}
            className="cursor-pointer"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
