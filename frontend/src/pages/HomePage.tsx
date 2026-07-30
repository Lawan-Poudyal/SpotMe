import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddEvent from '../components/Addfolder';
import DeleteEventModal from '../components/DeleteEvent';
import EditNameModal from '../components/ChangeEvent';
import PopUpBox from '../components/PopupBox';
import FolderCard from '../components/Folder';
import type { zuContextType } from '../context/zuContext';
import { useProfile } from '../context/zuContext';
import type { eventType } from '../types/eventType';
import { useEvents } from '../hooks/eventHooks';

import { CalendarDays, ImageIcon, Users, Search as SearchIcon, Plus } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const userName = useProfile((s: zuContextType) => s.userName);
  const userId = useProfile((s: zuContextType) => s.id);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: events = [] } = useEvents(userId) as { data: eventType[] };
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState(false);
  const [isChangeEventModalOpen, setIsChangeEventModalOpen] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);

  const [titleError, setTitleError] = useState('');
  const [subTitleError, setSubTitleError] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleRemoveButtonPressed = (eventId: string, eventName: string) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName);
    setIsDeleteEventModalOpen(true);
  };

  const handleChangeEventButtonPressed = (eventId: string, eventName: string) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName);
    setIsChangeEventModalOpen(true);
  };

  const totalPhotos = events.reduce((sum, item) => sum + Math.max(0, item.photoCount ?? 0), 0);

  const statsCards = [
    { label: 'Events', value: events.length, icon: <CalendarDays size={18} /> },
    { label: 'Photos', value: totalPhotos.toLocaleString(), icon: <ImageIcon size={18} /> },
  ];

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white">
      {/* POPUPS */}
      <PopUpBox
        title={titleError}
        subTitle={subTitleError}
        open={isErrorOpen}
        setOpen={setIsErrorOpen}
      />

      <AddEvent
        open={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        events={events}
        setTitleError={setTitleError}
        setSubTitleError={setSubTitleError}
        setIsErrorOpen={setIsErrorOpen}
        userId={userId}
      />

      <DeleteEventModal
        open={isDeleteEventModalOpen}
        onClose={() => setIsDeleteEventModalOpen(false)}
        events={events}
        setTitleError={setTitleError}
        setSubTitleError={setSubTitleError}
        setIsErrorOpen={setIsErrorOpen}
        eventId={selectedEventId as string}
        eventName={selectedEventName as string}
        userId={userId}
      />

      <EditNameModal
        open={isChangeEventModalOpen}
        onClose={() => setIsChangeEventModalOpen(false)}
        eventId={selectedEventId as string}
        currentName={selectedEventName as string}
        events={events}
        setTitleError={setTitleError}
        setSubTitleError={setSubTitleError}
        setIsErrorOpen={setIsErrorOpen}
        userId={userId}
      />

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {getGreeting()},<span className="text-[#F97316]"> {userName}</span>
          </h1>

          <p className="text-white/45 mt-2">Manage and browse your events.</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statsCards.map((card) => (
            <div key={card.label} className="rounded-3xl bg-[#232326] border border-white/5 p-5">
              <div className="text-white/40 mb-3">{card.icon}</div>
              <div className="text-3xl font-bold">{card.value}</div>
              <div className="text-white/35 text-sm mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="flex-1 bg-[#232326] rounded-2xl px-5 py-3 outline-none border border-white/10"
          />

          <button
            onClick={() => setIsAddEventOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F97316] hover:opacity-90"
          >
            <Plus size={18} />
            New Event
          </button>
        </div>

        {/* EVENTS */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-24">
            <CalendarDays size={50} className="mx-auto text-white/20" />
            <h2 className="mt-6 text-xl font-semibold">No events yet</h2>
            <p className="text-white/40 mt-2">Create your first event.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((item) => (
              <FolderCard
                key={item.id}
                name={item.eventName}
                createdAt={String(item.createdAt)}
                numberOfImages={Math.max(0, item.photoCount ?? 0)}
                thumbNailUrl={item.thumbnail?.photo_url ?? ''}
                onClick={() =>
                  navigate(`/dashboard/event/${item.id}`, {
                    state: item,
                  })
                }
                onEdit={
                  item.userId === userId
                    ? () => handleChangeEventButtonPressed(item.id, item.eventName)
                    : undefined
                }
                onRemove={
                  item.userId === userId
                    ? () => handleRemoveButtonPressed(item.id, item.eventName)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
