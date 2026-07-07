import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { X, Loader2, CalendarPlus } from 'lucide-react';
import type { eventType } from '../types/eventType';
import { useCreateEvent } from '../hooks/eventHooks';
import { handleNonUniqueEventNames } from '../utility/eventUtils';

type Props = {
  open: boolean;
  onClose: () => void;
  events: eventType[];
  setTitleError: Dispatch<SetStateAction<string>>;
  setSubTitleError: Dispatch<SetStateAction<string>>;
  setIsErrorOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
};

const AddEvent: React.FC<Props> = ({
  open,
  onClose,
  events,
  setTitleError,
  setSubTitleError,
  setIsErrorOpen,
  userId,
}) => {
  const [eventName, setEventName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const createEvent = useCreateEvent(
    eventName,
    events,
    userId,
    setIsLoading,
    setTitleError,
    setSubTitleError,
    setIsErrorOpen,
  );

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setEventName('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handleAdd = async () => {
    const conflictExists = handleNonUniqueEventNames(
      eventName,
      events,
      setTitleError,
      setSubTitleError,
      setIsErrorOpen,
    );
    if (!conflictExists) return;
    if (!eventName.trim()) return;
    createEvent.mutate();
    setEventName('');
    onClose();
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 bg-[#1C1C1E] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header stripe */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F97316]/15 text-[#F97316]">
              <CalendarPlus size={18} />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Create Event</h2>
              <p className="text-white/40 text-xs mt-0.5">Start collecting memories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
            Event Name
          </label>
          <input
            ref={inputRef}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) handleAdd();
            }}
            placeholder="e.g. KU Annual Fest 2026"
            className="w-full bg-[#232326] border border-white/10 rounded-xl px-4 py-3
              text-white placeholder-white/25 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#F97316]/60 focus:border-[#F97316]/40
              transition-all"
          />
          <p className="text-white/25 text-xs mt-2">Press Enter to quickly create</p>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70
              hover:bg-white/5 hover:text-white text-sm font-medium transition-all disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={isLoading || !eventName.trim()}
            className="flex-[2] py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA6C0A]
              text-white font-semibold text-sm transition-all disabled:opacity-50
              flex items-center justify-center gap-2 shadow-lg shadow-[#F97316]/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={15} />
                Creating…
              </>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
