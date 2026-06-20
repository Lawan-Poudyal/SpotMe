
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ImageIcon,
  Users,
  Link2,
  Upload,
  ScanFace,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
 
import AllPhotosTab from "./Allphotostab";
import FindMeTab from "./FindMeTab";
import UploadTab from "./Upload";
 
import { EVENTS_MOCK } from "../mockdata/eventMock";
 
type Tab = "all" | "findme" | "upload";
 
export default function EventDetails() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { state } = useLocation();
 
  const [activeTab, setActiveTab] = useState<Tab>("all");
 
  // 1. Navigation state first, 2. mock fallback
  const event = state || EVENTS_MOCK.find((e) => e.id === eventId);
 
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
      id: "all",
      label: "All photos",
      icon: <ImageIcon size={16} />,
    },
    {
      id: "findme",
      label: "Find me",
      icon: <ScanFace size={16} />,
    },
    {
      id: "upload",
      label: "Upload",
      icon: <Upload size={16} />,
    },
  ];
 
  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white">
      {/* ── Header ── */}
      <div className="border-b border-white/10 px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={18} />
          Back to events
        </button>
 
        <div className="flex justify-between items-start flex-wrap gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{event.eventName}</h1>
 
            <div className="flex gap-6 text-white/60 flex-wrap text-sm">
              {event.date && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {event.date}
                </div>
              )}
 
              <div className="flex items-center gap-2">
                <ImageIcon size={16} />
                {(event.numberOfImages ?? 0).toLocaleString()} photos
              </div>
 
              {event.people && (
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {event.people} people
                </div>
              )}
            </div>
          </div>
 
          <div className="flex gap-3">
            <button className="border border-white/20 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:border-white/40 transition">
              <Link2 size={16} />
              Copy link
            </button>
 
            <button
              onClick={() => setActiveTab("upload")}
              className="border border-white/20 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:border-white/40 transition"
            >
              <Upload size={16} />
              Add photos
            </button>
          </div>
        </div>
      </div>
 
      {/* ── Tabs ── */}
      <div className="border-b border-white/10 px-8">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-4 text-sm font-medium border-b-2 transition
                ${
                  activeTab === tab.id
                    ? "border-[#F97316] text-[#F97316]"
                    : "border-transparent text-white/50 hover:text-white/80"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
 
      {/* ── Tab Content ── */}
      <div className="p-8">
        {activeTab === "all" && <AllPhotosTab event={event} />}
        {activeTab === "findme" && <FindMeTab event={event} />}
        {activeTab === "upload" && <UploadTab event={event} />}
      </div>
    </div>
  );
}
