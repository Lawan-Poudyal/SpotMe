import { useEffect, useRef, useState } from 'react';
import { Link2, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inviteLink } from '../api/inviteLinkApi';

export default function JoinEvent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [code, setCode] = useState(() => {
    return searchParams.get('code') || '';
  });

  const {
    mutate: joinEvent,
    isPending,
    isError,
    error,
    reset: resetMutation,
  } = useMutation({
    mutationFn: (inviteCode: string) => {
      console.log('[join] mutationFn called', inviteCode, Date.now());
      return inviteLink.join(inviteCode);
    },
    onError: (err) => {
      console.log('[join] onError', err);
    },
    onSuccess: (data) => {
      console.log('[join] onSuccess', data);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate(`/dashboard/event/${data.eventId}`, { replace: true });
    },
  });

  const hasAutoJoined = useRef(false);

  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode && !hasAutoJoined.current) {
      hasAutoJoined.current = true;
      joinEvent(urlCode);
    }
  }, []);

  const handleJoin = () => {
    if (!code.trim() || isPending) return;
    joinEvent(code.trim());
  };

  const errorMessage = isError
    ? error?.response?.data?.message || error.message || 'Failed to join event'
    : null;

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto bg-[#1C1C1E]">
      <div className="flex-1 px-6 lg:px-10 py-8 max-w-2xl w-full mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Join an event</h1>
          <p className="text-white/40 text-sm mt-2">
            Enter the invite code or paste a link shared by the organizer.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#2C2C2E] border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <Link2 size={18} className="text-orange-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Invite code</p>
            </div>
          </div>

          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (isError) resetMutation();
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="Paste code or link here…"
            className={`w-full bg-[#1C1C1E] border rounded-xl px-4 py-3 text-white text-sm
              placeholder-white/25 focus:outline-none transition
              ${errorMessage ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-orange-500/50'}`}
          />

          {errorMessage && <p className="text-red-400 text-xs mt-2">{errorMessage}</p>}

          <button
            onClick={handleJoin}
            disabled={isPending || !code.trim()}
            className="mt-5 w-full flex items-center justify-center gap-2
              px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold text-sm transition-all cursor-pointer"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Join event <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        <p className="text-white/20 text-xs text-center mt-6">
          Don't have a code? Ask the event organizer to share their invite link.
        </p>
      </div>
    </div>
  );
}
