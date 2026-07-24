import { useState } from 'react';
import { Download, GalleryThumbnails, ImageIcon, Trash2, X } from 'lucide-react'; // Added missing X import
import type { eventType } from '../types/eventType';
import { useQuery, useMutation } from '@tanstack/react-query';
import PopUpBox from '../components/PopupBox';
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
import { downloadPhoto } from '../utility/downloadImages';
import type { Photo } from '../types/photoType';
import { queryClient } from '../config/tanstack';
import { useUpdateThumbnail } from '../hooks/eventHooks';
import type { zuContextType } from '../context/zuContext';
import { useProfile } from '../context/zuContext';
import { useEvents } from '../hooks/eventHooks';

interface AllPhotosTabProps {
  event: eventType;
}

export default function AllPhotosTab({ event }: AllPhotosTabProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [titleError, setTitleError] = useState('');
  const [subTitleError, setSubTitleError] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isUpdatingThumb, setIsUpdatingThumb] = useState(false);
  const userId = useProfile((s: zuContextType) => s.id);
  const { data: events = [] } = useEvents(userId) as { data: eventType[] };
  const updateThumbnail = useUpdateThumbnail(
    event.eventName,
    event.id,
    events,
    setIsUpdatingThumb,
    setTitleError,
    setSubTitleError,
    setIsErrorOpen,
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['photos', event.id],
    queryFn: () => photo.getPhotos(event.id),
  });

  const deletePhoto = useMutation({
    mutationFn: (photoId: string) => photo.deletePhoto(photoId, event.id),
    onMutate: async (photoId) => {
      await queryClient.cancelQueries({ queryKey: ['photos', event.id] });
      await queryClient.cancelQueries({ queryKey: ['events', event.id] });
      await queryClient.cancelQueries({ queryKey: ['events'] });

      const previousPhotos = queryClient.getQueryData(['photos', event.id]);
      const previousEventDetails = queryClient.getQueryData(['events', event.id]);
      const previousEventsList = queryClient.getQueryData(['events']);

      queryClient.setQueryData(['photos', event.id], (old: Photo[] | undefined) =>
        old ? old.filter((p) => p.id !== photoId) : [],
      );

      queryClient.setQueryData(['events', event.id], (old: any) => {
        if (!old) return old;
        return { ...old, photoCount: Math.max(0, (old.photoCount ?? 0) - 1) };
      });

      queryClient.setQueryData(['events'], (old: any[] | undefined) => {
        if (!old) return [];
        return old.map((item) => {
          if (item.id !== event.id) return item;
          return { ...item, photoCount: Math.max(0, (item.photoCount ?? 0) - 1) };
        });
      });

      setConfirmOpen(false);
      setLightboxIndex(-1);
      return { previousPhotos, previousEventDetails, previousEventsList };
    },
    onError: (_err, _photoId, context) => {
      if (context) {
        queryClient.setQueryData(['photos', event.id], context.previousPhotos);
        queryClient.setQueryData(['events', event.id], context.previousEventDetails);
        queryClient.setQueryData(['events'], context.previousEventsList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', event.id] });
      queryClient.invalidateQueries({ queryKey: ['events', event.id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  if (isLoading) return <p className="text-white p-4">Loading...</p>;
  if (isError) return <p className="text-red-400 p-4">Error: {error.message}</p>;
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
      <PopUpBox
        title={titleError}
        subTitle={subTitleError}
        open={isErrorOpen}
        setOpen={setIsErrorOpen}
      />

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
        toolbar={{
          buttons: [
            <button
              key="Thumbnail"
              disabled={isUpdatingThumb}
              onClick={() =>
                updateThumbnail.mutate({
                  thumbnailId: data[lightboxIndex]?.id,
                  photo_url: data[lightboxIndex]?.photo_url,
                  width: data[lightboxIndex]?.width,
                  height: data[lightboxIndex]?.height,
                })
              }
              className="flex items-center justify-center w-10 h-10 rounded-lg text-[#555555] hover:text-[#E8572A] hover:bg-[#2a2a2a]/30 transition-all duration-200 disabled:opacity-40"
              title="Set as Thumbnail"
            >
              <GalleryThumbnails size={18} strokeWidth={1.75} />
            </button>,

            <button
              key="Download"
              onClick={() =>
                downloadPhoto(
                  data[lightboxIndex]?.photo_url,
                  `photo_${data[lightboxIndex]?.id}.jpg`,
                )
              }
              className="flex items-center justify-center w-10 h-10 rounded-lg text-[#555555] hover:text-white hover:bg-[#2a2a2a]/30 transition-all duration-200"
              title="Download photo"
            >
              <Download size={18} strokeWidth={1.75} />
            </button>,

            <button
              key="delete"
              onClick={() => setConfirmOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-[#555555] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              title="Delete photo"
            >
              <Trash2 size={18} strokeWidth={1.75} />
            </button>,

            <button
              key="close"
              onClick={() => setLightboxIndex(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-[#555555] hover:text-white hover:bg-[#2a2a2a]/30 transition-all duration-200"
              title="Close Lightbox"
            >
              <X size={18} strokeWidth={1.75} />
            </button>,
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
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              const photoId = data[lightboxIndex]?.id;
              if (photoId) deletePhoto.mutate(photoId);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
