import { useState } from 'react';
import {
  CalendarDays,
  ImageIcon,
  XCircle,
  Crown,
  Users,
  Clock,
  ChevronRight,
  Search,
} from 'lucide-react';
import AddEvent from '../components/AddEvent';
import type { eventType } from '../types/eventType';

type MyEventsProps = {
  userId: string;
};

type EventTab = 'all' | 'created' | 'joined';

// Mock joined events shape (events the user did not create)
type JoinedEvent = {
  id: string;
  eventName: string;
  createdAt: string;
  numberOfImages: number;
  organizer: string;
  coverColor: string; // placeholder gradient color
};

const MOCK_JOINED: JoinedEvent[] = [
  {
    id: 'j1',
    eventName: 'KU Annual Fest 2026',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    numberOfImages: 142,
    organizer: 'Priya S.',
    coverColor: '#7C3AED',
  },
  {
    id: 'j2',
    eventName: 'Holi Night 2026',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    numberOfImages: 87,
    organizer: 'Rajan M.',
    coverColor: '#DB2777',
  },
];

export default function MyEvents({ userId }: MyEventsProps) {
  const [events, setEvents] = useState<eventType[]>([]);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EventTab>('all');
  const [search, setSearch] = useState('');

  const [titleError, setTitleError] = useState('');
  const [subTitleError, setSubTitleError] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const tabs: { key: EventTab; label: string }[] = [
    { key: 'all', label: 'All events' },
    { key: 'created', label: 'Created' },
    { key: 'joined', label: 'Joined' },
  ];

  const filteredCreated = events.filter((e) =>
    e.eventName.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredJoined = MOCK_JOINED.filter((e) =>
    e.eventName.toLowerCase().includes(search.toLowerCase()),
  );

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
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all"
            >
              + Create Event
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
                className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 rounded-xl pl-8 pr-4 py-2 focus:outline-none focus:border-orange-500/50 transition"
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
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition"
              >
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
                <Crown size={14} className="text-orange-400" />
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
                  id={event.id}
                  name={event.eventName}
                  createdAt={event.createdAt}
                  imageCount={event.numberOfImages}
                  badge="Created"
                  badgeColor="orange"
                  accentColor="#F97316"
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
                <Users size={14} className="text-sky-400" />
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
                  id={event.id}
                  name={event.eventName}
                  createdAt={event.createdAt}
                  imageCount={event.numberOfImages}
                  badge="Joined"
                  badgeColor="sky"
                  accentColor={event.coverColor}
                  organizer={event.organizer}
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
        setEvents={setEvents}
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
type EventCardProps = {
  id: string;
  name: string;
  createdAt: string;
  imageCount: number;
  badge: 'Created' | 'Joined';
  badgeColor: 'orange' | 'sky';
  accentColor: string;
  organizer?: string;
};

function EventCard({
  name,
  createdAt,
  imageCount,
  badge,
  badgeColor,
  accentColor,
  organizer,
}: EventCardProps) {
  const badgeClasses =
    badgeColor === 'orange'
      ? 'bg-orange-500/15 text-orange-400 border-orange-500/20'
      : 'bg-sky-500/15 text-sky-400 border-sky-500/20';

  const daysAgo = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  const timeLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`;

  return (
    <div className="group bg-[#2C2C2E] border border-white/8 rounded-2xl p-4 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-4">
      {/* Color swatch / avatar */}
      <div
        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-lg font-bold"
        style={{ background: accentColor }}
      >
        {name.charAt(0).toUpperCase()}
      </div>

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

