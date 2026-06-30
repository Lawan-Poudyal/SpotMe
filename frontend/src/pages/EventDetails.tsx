import { useState } from 'react';
import { ArrowLeft, Calendar, ImageIcon, Link2, Upload, ScanFace, Download } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { photo } from '../api/photoApi';
import AllPhotosTab from './Allphotostab';
import FindMeTab from './FindMeTab';
import UploadTab from './Upload';

import { EVENTS_MOCK } from '../mockdata/eventMock';
import { useQuery } from '@tanstack/react-query';
import { downloadBulk } from '../utility/downloadImages';

type Tab = 'all' | 'findme' | 'upload';

export default function EventDetails() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { state } = useLocation();

  const [activeTab, setActiveTab] = useState<Tab>('all');

  const event = state || EVENTS_MOCK.find((e) => e.id === eventId);

  const { data } = useQuery({
    queryKey: ['photos', event.id],
    queryFn: () => photo.getPhotos(event.id),
  });

  if (!event) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event not found</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-white/60 hover:text-white transition"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="bg-[#1C1C1E] min-h-screen px-8 pt-3 pb-6">
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
          <MetaPill icon={<ImageIcon size={13} />} label={`${data?.length} photos`} />

          <div className="w-px h-4 bg-white/10 mx-1" />

          <ActionButton icon={<Link2 size={14} />} label="Copy link" />
          <ActionButton
            icon={<Download size={14} />}
            onClick={() => downloadBulk(data ?? [])}
            label="Download"
          />
        </div>
      </div>

      <div className="border-b border-white/10 px-8">
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
    <div className="flex  items-center gap-1.5 text-white/40 text-xs px-2.5 py-1 rounded-md bg-white/4">
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
      className={`flex items-center cursor-pointer gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
        primary
          ? 'bg-white text-black font-medium hover:bg-white/90'
          : 'border border-white/10 text-white/60 hover:text-white hover:border-white/25 hover:bg-white/4'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
