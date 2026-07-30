import { useState } from 'react';
import {
  CalendarDays,
  ImageIcon,
  XCircle,
  Users,
  Clock,
  ChevronRight,
  Search,
  Plus,
} from 'lucide-react';
import AddEvent from '../components/Addfolder';
import type { eventType } from '../types/eventType';
import { useEvents } from '../hooks/eventHooks';
import { useNavigate } from 'react-router-dom';

type MyEventsProps = {
  userId: string;
};

type EventTab = 'all' | 'created' | 'joined';

export default function MyEvents({ userId }: MyEventsProps) {
  const navigate = useNavigate();
  const { data: events = [] } = useEvents(userId) as { data: eventType[] };

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EventTab>('all');
  const [search, setSearch] = useState('');

  const [titleError, setTitleError] = useState('');
  const [subTitleError, setSubTitleError] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  // Split real events into created vs joined based on ownership
  const createdEvents = events.filter((e) => e.userId === userId);
  const joinedEvents = events.filter((e) => e.userId !== userId);

  const tabs: { key: EventTab; label: string }[] = [
    { key: 'all', label: 'All events' },
    { key: 'created', label: 'Created' },
    { key: 'joined', label: 'Joined' },
  ];

  const filteredCreated = createdEvents.filter((e) =>
    e.eventName.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredJoined = joinedEvents.filter((e) =>
    e.eventName.toLowerCase().includes(search.toLowerCase()),
  );

  console.log(filteredCreated);
  console.log(filteredJoined);
  const showCreated = activeTab === 'all' || activeTab === 'created';
  const showJoined = activeTab === 'all' || activeTab === 'joined';

  const isEmpty =
    (showCreated ? filteredCreated.length : 0) + (showJoined ? filteredJoined.length : 0) === 0;

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-[#1C1C1E]">
      <div className="flex-1 px-6 lg:px-10 py-8 max-w-5xl w-full mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#1C1C1E]/90 backdrop-blur-md pb-5 mb-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-3xl font-bold text-white">My Events</h1>
              <p className="text-white/40 text-sm mt-1">Events you've created or joined</p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA6C0A] text-white font-semibold text-sm transition-all shadow-lg shadow-[#F97316]/20"
            >
              <Plus size={15} />
              Create Event
            </button>
          </div>

          {/* Tabs + Search row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tabs */}
            <div className="flex items-center bg-white/5 rounded-xl p-1 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'created' && createdEvents.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-[#F97316]/20 text-[#F97316] px-1.5 py-0.5 rounded-full">
                      {createdEvents.length}
                    </span>
                  )}
                  {tab.key === 'joined' && joinedEvents.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded-full">
                      {joinedEvents.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events…"
                className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 rounded-xl pl-8 pr-4 py-2 focus:outline-none focus:border-[#F97316]/50 transition"
              />
            </div>
          </div>
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="border border-white/10 bg-[#2C2C2E] rounded-2xl py-16 px-8 flex flex-col items-center justify-center text-center">
            <CalendarDays size={40} className="text-white/20 mb-4" />
            <h2 className="text-white text-lg font-semibold mb-2">No events here yet</h2>
            <p className="text-white/40 text-sm max-w-sm mb-6">
              {activeTab === 'joined'
                ? "You haven't joined any events. Ask an organizer for an invite link."
                : 'Create your first event and start collecting memories.'}
            </p>
            {activeTab !== 'joined' && (
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA6C0A] text-white font-semibold text-sm transition shadow-lg shadow-[#F97316]/20"
              >
                <Plus size={15} />
                Create First Event
              </button>
            )}
          </div>
        )}

        {/* Created Events Section */}
        {showCreated && filteredCreated.length > 0 && (
          <div className="mb-8">
            {activeTab === 'all' && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                  Created by you
                </span>
                <span className="ml-auto text-white/30 text-xs">{filteredCreated.length}</span>
              </div>
            )}

            <div className="grid gap-3">
              {filteredCreated.map((event) => (
                <EventCard
                  key={event.id}
                  name={event.eventName}
                  createdAt={String(event.createdAt)}
                  imageCount={Math.max(0, event.photoCount ?? 0)}
                  badge="Created"
                  badgeColor="orange"
                  accentColor="#F97316"
                  thumbnail={event.thumbnail?.photo_url}
                  onClick={() => navigate(`/dashboard/event/${event.id}`, { state: event })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Joined Events Section */}
        {showJoined && filteredJoined.length > 0 && (
          <div>
            {activeTab === 'all' && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                  Joined
                </span>
                <span className="ml-auto text-white/30 text-xs">{filteredJoined.length}</span>
              </div>
            )}

            <div className="grid gap-3">
              {filteredJoined.map((event) => (
                <EventCard
                  key={event.id}
                  name={event.eventName}
                  createdAt={String(event.createdAt)}
                  imageCount={Math.max(0, event.photoCount ?? 0)}
                  badge="Joined"
                  badgeColor="blue"
                  thumbnail={event.thumbnail?.photo_url}
                  accentColor="#0EA5E9"
                  onClick={() => navigate(`/dashboard/event/${event.id}`, { state: event })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      <AddEvent
        open={open}
        onClose={() => setOpen(false)}
        events={events}
        setTitleError={setTitleError}
        setSubTitleError={setSubTitleError}
        setIsErrorOpen={setIsErrorOpen}
        userId={userId}
      />

      {/* Error Toast */}
      {isErrorOpen && (
        <div className="fixed bottom-6 right-6 z-[100] bg-red-500 text-white p-4 rounded-2xl shadow-xl min-w-[280px] border border-red-400">
          <div className="flex items-start gap-3">
            <XCircle size={20} className="mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold">{titleError}</h3>
              <p className="text-sm text-white/90 mt-1">{subTitleError}</p>
            </div>
          </div>
          <button
            onClick={() => setIsErrorOpen(false)}
            className="mt-4 text-xs underline text-white/90 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Event Card ─── */
interface EventCardProps {
  name: string;
  createdAt: string;
  imageCount: number;
  badge: string;
  badgeColor: 'orange' | 'blue';
  accentColor: string;
  organizer?: string;
  thumbnail?: string;
  onClick: () => void;
}

function EventCard({
  name,
  createdAt,
  imageCount,
  badge,
  badgeColor,
  accentColor,
  organizer,
  thumbnail,
  onClick,
}: EventCardProps) {
  const badgeClasses =
    badgeColor === 'orange'
      ? 'bg-orange-500/15 text-orange-400 border-orange-500/20'
      : 'bg-sky-500/15 text-sky-400 border-sky-500/20';

  const timeLabel = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <div
      onClick={onClick}
      className="group bg-[#2C2C2E] border border-white/8 rounded-2xl p-4 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-4"
    >
      {/* Color swatch / avatar */}
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={name}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div
          className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-lg font-bold"
          style={{ background: accentColor }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-white font-semibold text-base truncate">{name}</h2>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${badgeClasses}`}
          >
            {badge}
          </span>
        </div>

        <div className="flex items-center gap-3 text-white/35 text-xs">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {timeLabel}
          </span>
          <span className="flex items-center gap-1">
            <ImageIcon size={11} />
            {imageCount} photos
          </span>
          {organizer && (
            <span className="flex items-center gap-1">
              <Users size={11} />
              {organizer}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight
        size={16}
        className="text-white/20 group-hover:text-white/50 flex-shrink-0 transition-colors"
      />
    </div>
  );
}
