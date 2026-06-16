import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import AddButton from "../components/AddButton";
import FolderCard from "../components/Folder";
import AddEvent from "../components/Addfolder";
import DeleteEventModal from "../components/DeleteEvent";
import EditNameModal from "../components/ChangeEvent";
import PopUpBox from "../components/PopupBox";
import type { eventType } from "../types/eventType";
import { onGetEvent } from "../utility/eventUtils";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { CalendarDays, ImageIcon, Users, FolderOpen } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<eventType[]>([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState<boolean>(false);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState<boolean>(false);
  const [isChangeEventModalOpen, setIsChangeEventModalOpen] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string>("");
  const [subTitleError, setSubTitleError] = useState<string>("");
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);
  const userContext = useContext(UserContext);

  useEffect(() => {
    onGetEvent(
      setTitleError,
      setSubTitleError,
      setIsErrorOpen,
      setEvents,
      userContext?.contextState?.id as string
    );
  }, []);

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

  const handleOnCloseAddEvent = () => setIsAddEventOpen(false);
  const handleOnCloseDeleteEvent = () => setIsDeleteEventModalOpen(false);
  const handleOnChangeEvent = () => setIsChangeEventModalOpen(false);

  const statsCards = [
    {
      label: "Events",
      value: events.length,
      icon: <CalendarDays size={22} />,
      sub: "events joined",
    },
    {
      label: "Photos",
      value: 24,
      icon: <ImageIcon size={22} />,
      sub: "photos uploaded",
    },
    {
      label: "People",
      value: 138,
      icon: <Users size={22} />,
      sub: "connections",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F17] flex flex-col">
      {/* Modals */}
      <PopUpBox
        title={titleError as string}
        subTitle={subTitleError as string}
        open={isErrorOpen}
        setOpen={setIsErrorOpen}
      />
      <AddEvent
        open={isAddEventOpen}
        onClose={handleOnCloseAddEvent}
        events={events}
        setTitleError={setTitleError}
        setSubTitleError={setSubTitleError}
        setIsErrorOpen={setIsErrorOpen}
        setEvents={setEvents}
        userId={userContext?.contextState?.id as string}
      />
      <DeleteEventModal
        open={isDeleteEventModalOpen}
        onClose={handleOnCloseDeleteEvent}
        events={events}
        setTitleError={setTitleError}
        setSubTitleError={setSubTitleError}
        setIsErrorOpen={setIsErrorOpen}
        setEvents={setEvents}
        eventName={selectedEventName as string}
        userId={userContext?.contextState?.id as string}
        eventId={selectedEventId as string}
      />
      <EditNameModal
        open={isChangeEventModalOpen}
        onClose={handleOnChangeEvent}
        eventId={selectedEventId as string}
        currentName={selectedEventName as string}
        events={events}
        setTitleError={setTitleError}
        setSubTitleError={setSubTitleError}
        setIsErrorOpen={setIsErrorOpen}
        setEvents={setEvents}
        userId={userContext?.contextState?.id as string}
      />

      {/* Page content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statsCards.map((card) => (
            <div
              key={card.label}
              className="bg-[#1A1A2E] rounded-2xl p-5 flex items-center gap-4
                border border-white/[0.07] border-l-[3px] border-l-[#F97316]
                hover:bg-[#20203A] hover:border-l-[#F97316] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] shrink-0">
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-[#EAEAF5] leading-tight">{card.value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#555570] mt-0.5">
                  {card.label}
                </p>
                <p className="text-[11px] text-[#44445A] mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Events Section */}
        {events.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#F97316]/10 flex items-center justify-center">
              <FolderOpen size={40} className="text-[#F97316]" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-[#EAEAF5]">No events yet</h2>
              <p className="text-sm text-[#555570] mt-1 max-w-xs leading-relaxed">
                Add your first event to start organizing and tracking everything in one place.
              </p>
            </div>
            <AddButton setOpen={setIsAddEventOpen} />
          </div>
        ) : (
          <>
            {/* Section header bar */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="w-[3px] h-5 rounded-full bg-[#F97316] inline-block" />
                <h2 className="text-sm font-bold text-[#EAEAF5] tracking-tight">Your Events</h2>
                <span className="ml-1 text-[11px] font-medium bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded-full">
                  {events.length}
                </span>
              </div>
              <AddButton setOpen={setIsAddEventOpen} />
            </div>

            {/* Folder grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {events.map((item) => (
                <FolderCard
		  createdAt={item.createdAt as Date}
                  name={item.eventName}
                  key={item.id}
                  onRemove={() => handleRemoveButtonPressed(item.id, item.eventName)}
                  onEdit={() => handleChangeEventButtonPressed(item.id, item.eventName)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
