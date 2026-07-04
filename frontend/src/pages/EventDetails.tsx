import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Link2,
  Upload,
  ScanFace,
  Download,
} from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { skipToken, useMutation, useQuery } from '@tanstack/react-query';
import AllPhotosTab from './Allphotostab';
import FindMeTab from './FindMeTab';
import UploadTab from './Upload';
import { downloadBulk } from '../utility/downloadImages';
import { inviteLink } from '../api/inviteLinkApi';
import { queryClient } from '../config/tanstack';
import { getEventById } from '../api/eventApi';
import { uploadEventPhotos } from '../api/eventPhotoUploadApi';
import { fileUploads } from '../api/fileUploadApi';
import { useProfile } from '../context/zuContext';
import type { zuContextType } from '../context/zuContext';
import { io } from 'socket.io-client';
import PopUpBox from '../components/PopupBox';
import { photo } from '../api/photoApi';

type Tab = 'all' | 'findme' | 'upload';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All photos', icon: <ImageIcon size={16} /> },
  { id: 'findme', label: 'Find me', icon: <ScanFace size={16} /> },
  { id: 'upload', label: 'Upload', icon: <Upload size={16} /> },
];

// ── Shared type, now owned by the parent ─────────────────
export interface UploadFile {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  source: 'local' | 'drive';
  driveFileId?: string;
}

type dataType = {
  success: boolean;
  driveFileId: string;
};

export default function EventDetails() {
  const navigate = useNavigate();
  const { eventId: id } = useParams<{ eventId: string }>();
  const { state: routerState } = useLocation();

  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const userId = useProfile((s: zuContextType) => s.id);

  const {
    data: event,
    isLoading: eventLoading,
    isError,
  } = useQuery({
    queryKey: ['events', id],
    queryFn: () => getEventById(id!),
    initialData: routerState,
    enabled: !!id,
    staleTime: routerState ? 30_000 : 0,
  });

  const { data: photos } = useQuery({
    queryKey: ['photos', event?.id],
    queryFn: event?.id ? () => photo.getPhotos(event.id) : skipToken,
  });

  // ── Upload queue state — lives here so it survives tab switches ──
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');

  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const pendingDriveSocketRef = useRef<Set<string>>(new Set());
  const anyDriveSuccessRef = useRef<boolean>(false);

  // ── Error popup state — also lifted, since handleUpload needs the setters ──
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [subErrorTitle, setSubErrorTitle] = useState<string>('');
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
      auth: { userId },
    });
    socketRef.current = socket;

    socket.on('image_news', (data: dataType) => {
      const { success, driveFileId } = data;

      setFiles((prev) =>
        prev.map((f) =>
          f.driveFileId === driveFileId
            ? { ...f, status: success ? 'done' : 'error', progress: success ? 100 : f.progress }
            : f,
        ),
      );

      if (success) anyDriveSuccessRef.current = true;

      pendingDriveSocketRef.current.delete(driveFileId);

      if (pendingDriveSocketRef.current.size === 0) {
        if (anyDriveSuccessRef.current) {
          queryClient.invalidateQueries({ queryKey: ['photos', id] });
        }
        anyDriveSuccessRef.current = false;
        setFiles((prev) => prev.filter((f) => f.status !== 'done'));
        setIsUploading(false);
      }
    });

    return () => {
      socket.off('image_news');
      socket.disconnect();
    };
  }, [userId]);

  const addFiles = (incoming: FileList | File[]) => {
    const imageFiles = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    const mapped: UploadFile[] = imageFiles.map((f) => ({
      id: `${f.name}-${f.lastModified}-${Math.random()}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: 'pending',
      progress: 0,
      source: 'local',
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const addDriveFiles = (
    driveFiles: {
      id: string;
      name: string;
      mimeType: string;
      url: string;
      sizeBytes?: number;
      thumbnailUrl?: string;
    }[],
  ) => {
    const mapped: UploadFile[] = driveFiles.map((df) => ({
      id: `drive-${df.id}-${Math.random()}`,
      file: new File([], df.name, { type: df.mimeType }),
      previewUrl: df.thumbnailUrl ?? '',
      status: 'pending',
      progress: 0,
      source: 'drive',
      driveFileId: df.id,
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === fileId);
      if (target && target.source === 'local') URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const setFileStatus = (ids: string[], status: UploadFile['status'], progress?: number) => {
    setFiles((prev) =>
      prev.map((f) =>
        ids.includes(f.id) ? { ...f, status, progress: progress ?? f.progress } : f,
      ),
    );
  };

  const uploadSignatureMutation = useMutation({
    mutationFn: () => fileUploads.signRequest(id!),
  });

  const saveUploadMutation = useMutation({
    mutationFn: (photos: { url: string; publicId: string; width: number; height: number }[]) =>
      fileUploads.saveUpload(id!, photos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', id] });
    },
  });

  const handleUpload = async () => {
    if (files.length === 0 || isUploading) return;
    setIsUploading(true);

    const localFiles = files.filter((f) => f.source === 'local');
    const driveFiles = files.filter((f) => f.source === 'drive');

    setFiles((prev) => prev.map((f) => ({ ...f, status: 'uploading' as const, progress: 0 })));

    if (localFiles.length > 0) {
      try {
        const sig = await uploadSignatureMutation.mutateAsync();
        setFileStatus(
          localFiles.map((f) => f.id),
          'uploading',
          30,
        );

        const uploads = localFiles.map((f) => {
          const formData = new FormData();
          formData.append('file', f.file);
          formData.append('api_key', sig.apiKey);
          formData.append('timestamp', sig.timestamp.toString());
          formData.append('signature', sig.signature);
          formData.append('folder', sig.folder);
          return fileUploads.uploadFile(formData, sig.cloudName).then((res) => ({ f, res }));
        });

        setFileStatus(
          localFiles.map((f) => f.id),
          'uploading',
          60,
        );

        const results = await Promise.allSettled(uploads);

        const succeeded = results
          .filter(
            (r): r is PromiseFulfilledResult<{ f: UploadFile; res: any }> =>
              r.status === 'fulfilled',
          )
          .map((r) => r.value);

        const failedIds = results
          .map((r, i) => (r.status === 'rejected' ? localFiles[i].id : null))
          .filter((idVal): idVal is string => idVal !== null);

        if (succeeded.length > 0) {
          setFileStatus(
            succeeded.map(({ f }) => f.id),
            'uploading',
            90,
          );

          await saveUploadMutation.mutateAsync(
            succeeded.map(({ res }) => ({
              url: res.secure_url,
              publicId: res.public_id,
              width: res.width,
              height: res.height,
            })),
          );
          setFileStatus(
            succeeded.map(({ f }) => f.id),
            'done',
            100,
          );
        }

        if (failedIds.length > 0) {
          setFileStatus(failedIds, 'error');
        }
      } catch {
        setFileStatus(
          localFiles.map((f) => f.id),
          'error',
        );
      }
    }

    if (driveFiles.length > 0) {
      const driveFileIds = driveFiles
        .map((f) => f.driveFileId)
        .filter((idVal): idVal is string => Boolean(idVal));

      pendingDriveSocketRef.current = new Set(driveFileIds);
      anyDriveSuccessRef.current = false;

      setFileStatus(
        driveFiles.map((f) => f.id),
        'uploading',
        20,
      );

      const driveSuccess = await uploadEventPhotos({
        eventId: String(id),
        ownerId: String(userId),
        accessToken,
        driveFileIds,
        setIsUploading: () => {},
        setErrorTitle,
        setSubErrorTitle,
        setIsErrorOpen,
      });

      if (!driveSuccess) {
        setFileStatus(
          driveFiles.map((f) => f.id),
          'error',
        );
        pendingDriveSocketRef.current.clear();
        setIsUploading(false);
        return;
      }

      setFileStatus(
        driveFiles.map((f) => f.id),
        'uploading',
        60,
      );
    }

    if (driveFiles.length === 0) {
      setFiles((prev) => prev.filter((f) => f.status !== 'done'));
      setIsUploading(false);
    }
  };

  const handleInviteLink = useMutation({
    mutationFn: () => inviteLink.generate(id!),
    onSuccess: (data) => {
      queryClient.setQueryData(['inviteLink', id], data.token ?? null);
      if (data.token) {
        const inviteLinkUrl = `${window.location.origin}/join/${data.token}`;
        navigator.clipboard.writeText(inviteLinkUrl);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    },
  });

  if (!id || eventLoading) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-t-transparent border-orange-500 rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event not found</h1>
          <button
            onClick={() => navigate('/dashboard/home')}
            className="text-orange-500 hover:text-orange-400 font-medium text-sm transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C1E] min-h-screen px-8  pb-6">
      <header className="sticky top-0 z-50 bg-[#1C1C1E] pt-3">
        <PopUpBox
          title={errorTitle}
          subTitle={subErrorTitle}
          open={isErrorOpen}
          setOpen={setIsErrorOpen}
        />

        <div className="flex mb-2 gap-3 items-center ">
          <button
            onClick={() => navigate(-1)}
            style={{ outline: 'none', boxShadow: 'none' }}
            className="shrink-0 cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg bg-white/20"
          >
            <ArrowLeft size={15} color="#E4E4E7" />
          </button>

          <span className="text-white text-3xl font-sans truncate min-w-0">{event.eventName}</span>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <MetaPill
              icon={<Calendar size={13} />}
              label={new Date(event.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            />
            <MetaPill icon={<ImageIcon size={13} />} label={`${event.photoCount} photos`} />

            <div className="w-px h-4 bg-white/10 mx-1" />

            <ActionButton
              onClick={() => handleInviteLink.mutate()}
              icon={<Link2 size={14} />}
              label={isCopied ? 'Copied!' : handleInviteLink.isPending ? 'Copying...' : 'Copy link'}
            />
            <ActionButton
              icon={<Download size={14} />}
              onClick={() => downloadBulk(photos ?? [], event.eventName)}
              label="Download"
            />
          </div>
        </div>

        <div className="border-b border-white/10">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 text-sm font-medium border-b-2 transition
                  ${
                    activeTab === tab.id
                      ? 'border-[#F97316] text-[#F97316]'
                      : 'border-transparent text-white/50 hover:text-white/80'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-8">
        {activeTab === 'all' && <AllPhotosTab event={event} />}
        {activeTab === 'findme' && <FindMeTab event={event} />}
        {activeTab === 'upload' && (
          <UploadTab
            event={event}
            files={files}
            isUploading={isUploading}
            accessToken={accessToken}
            setAccessToken={setAccessToken}
            addFiles={addFiles}
            addDriveFiles={addDriveFiles}
            removeFile={removeFile}
            handleUpload={handleUpload}
            setErrorTitle={setErrorTitle}
            setSubErrorTitle={setSubErrorTitle}
            setIsErrorOpen={setIsErrorOpen}
          />
        )}
      </div>
    </div>
  );
}

function MetaPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-white/40 text-xs px-2.5 py-1 rounded-md bg-white/5">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  primary,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`flex items-center cursor-pointer gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all focus:outline-none ${
        primary
          ? 'bg-white text-black font-medium hover:bg-white/90'
          : 'border border-white/10 text-white/60 hover:text-white hover:border-white/25 hover:bg-white/5'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
