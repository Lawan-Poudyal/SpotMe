import { useState } from 'react';
import { Link2, ArrowRight, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function JoinEvent() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const prefillCode = searchParams.get('code');

  const handleJoin = async () => {
    if (!code.trim()) {
      setError('Please enter an invite code or link.');
      return;
    }
    setError('');
    setLoading(true);

    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setError('Event not found. Check the code and try again.');
  };

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
              if (error) setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="Paste code or link here…"
            className={`w-full bg-[#1C1C1E] border rounded-xl px-4 py-3 text-white text-sm
              placeholder-white/25 focus:outline-none transition
              ${error ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-orange-500/50'}`}
          />

          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

          <button
            onClick={handleJoin}
            disabled={loading}
            className="mt-5 w-full flex items-center justify-center gap-2
              px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600
              disabled:opacity-60 disabled:cursor-not-allowed
              text-white font-semibold text-sm transition-all"
          >
            {loading ? (
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

