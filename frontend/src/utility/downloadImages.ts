import JSZip from 'jszip';
import type { Photo } from '../types/photoType';

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

const downloadBulk = async (images: Photo[]) => {
  const zip = new JSZip();

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
  a.download = 'photos.zip';
  a.click();
};

export { downloadPhoto, downloadBulk };
