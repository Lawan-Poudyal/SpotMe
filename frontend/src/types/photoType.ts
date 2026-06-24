export type Photo = {
  id: string;
  photo_url: string;
  event_id: string;
  public_id: string;
  uploaded_at: string;
  uploaded_by: string;
  height: number;
  width: number;
};

export type DownloadImage = {
  url: string;
  filename: string;
};
