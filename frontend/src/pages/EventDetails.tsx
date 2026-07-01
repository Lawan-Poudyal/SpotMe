import { useState } from 'react';
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
import { useMutation, useQuery } from '@tanstack/react-query';
import AllPhotosTab from './Allphotostab';
import FindMeTab from './FindMeTab';
import UploadTab from './Upload';
import { downloadBulk } from '../utility/downloadImages';
import { inviteLink } from '../api/inviteLinkApi';
import { queryClient } from '../config/tanstack';
import { getEventById } from '../api/eventApi';

type Tab = 'all' | 'findme' | 'upload';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'all',
    label: 'All photos',
    icon: <ImageIcon size={16} />,
  },
  {
    id: 'findme',
    label: 'Find me',
    icon: <ScanFace size={16} />,
  },
  {
    id: 'upload',
    label: 'Upload',
    icon: <Upload size={16} />,
  },
];

export default function EventDetails() {
  const navigate = useNavigate();
  const { eventId: id } = useParams<{ eventId: string }>();
  console.log({ id });
  const { state: routerState } = useLocation();

  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const {
    data: fetchedEvent,
    isLoading: eventLoading,
    isError,
  } = useQuery({
    queryKey: ['events', id],
    queryFn: () => getEventById(id!),
    initialData: routerState,
    staleTime: routerState ? 30_000 : 0,
  });

  const event = routerState || fetchedEvent;
  console.log({ routerState });
  console.log({ fetchedEvent });

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

  if (id && eventLoading) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-t-transparent border-orange-500 rounded-full animate-spin mx-auto" />
          <p className="text-white/40 text-sm">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!id || isError || !event) {
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
        {/* Title & Action Buttons Row */}
        <div className="flex mb-2 gap-3 items-center">
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
              onClick={() => downloadBulk(event ?? [])}
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
        {activeTab === 'upload' && <UploadTab event={event} />}
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
