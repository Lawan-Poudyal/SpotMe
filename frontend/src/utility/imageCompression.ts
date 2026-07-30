import imageCompression from 'browser-image-compression';

async function prepareForUpload(file: File): Promise<File> {
  return imageCompression(file, {
    maxWidthOrHeight: 2000,
    maxSizeMB: 1.5,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.85,
  });
}
export default prepareForUpload;
