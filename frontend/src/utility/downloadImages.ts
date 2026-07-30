import JSZip from 'jszip';
import type { Photo } from '../types/photoType';
import { queryClient } from '../config/tanstack';
import type { eventType } from '../types/eventType';

const downloadPhoto = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const blobURL = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobURL;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(blobURL);
};

const downloadBulk = async (activeTab : string , event: eventType , userId : string) => {
  const zip = new JSZip();
  let images: Photo[]
  if(activeTab === "findme"){
      images = queryClient.getQueryData(['myPhotos' , event.id , userId]) ?? []
  }
  else{
      images = queryClient.getQueryData(['photos' , event.id ]) ?? []
  }

  if(images.length ===0) return alert("There are not photos to download")

  await Promise.all(
    images.map(async (image: Photo) => {
      const res = await fetch(image.photo_url);
      const blob = await res.blob();
      zip.file(image.id, blob);
    }),
  );

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(zipBlob);
  a.download = `${event.eventName}.zip`;
  a.click();
};

export { downloadPhoto, downloadBulk };
