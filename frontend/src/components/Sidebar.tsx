import React from "react";
import { Home, CalendarDays, UserPlus, Clock, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";

type SidebarSection = "home" | "myevents" | "joinevent";
type SidebarProps = {
  activeSection: SidebarSection;
  setActiveSection: (section: SidebarSection) => void;
};

const recentEvents = ["KUCC Hackathon", "Tech Summit 2025", "Open Source Day"];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: { label: string; key: SidebarSection; icon: React.ReactNode }[] = [
    { label: "Home", key: "home", icon: <Home size={18} /> },
    { label: "My Events", key: "myevents", icon: <CalendarDays size={18} /> },
    { label: "Join Event", key: "joinevent", icon: <UserPlus size={18} /> },
  ];

  return (
    <>
      {/* Mobile overlay toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#0F0F17] border border-white/10 text-white p-2 rounded-lg shadow-lg"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          bg-[#0F0F17] text-white flex flex-col
          border-r border-white/[0.06]
          transition-all duration-300 ease-in-out shrink-0
          fixed md:relative z-40 h-full md:h-auto
          ${collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-64"}
        `}
        style={{ minHeight: "100vh" }}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center shrink-0">
            <CalendarDays size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight text-[#EAEAF5]">EventHub</span>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden md:flex ml-auto text-white/20 hover:text-white/60 transition"
            aria-label="Collapse sidebar"
          >
            <ChevronRight
              size={16}
              className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
            />
          </button>
        </div>

        {/* Menu */}
        <div className="px-3 pt-6 flex-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 px-3 mb-2">
              Menu
            </p>
          )}
          <nav className="flex flex-col gap-0.5">
            {menuItems.map(({ label, key, icon }) => {
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  title={collapsed ? label : undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left
                    text-sm font-medium transition-all duration-150
                    ${isActive
                      ? "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20"
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.04] border border-transparent"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <span className={isActive ? "text-[#F97316]" : ""}>{icon}</span>
                  {!collapsed && <span>{label}</span>}
                  {!collapsed && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Recent */}
          <div className="mt-8">
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 px-3 mb-2">
                Recent
              </p>
            )}
            {collapsed ? (
              <div className="flex justify-center">
                <Clock size={18} className="text-white/20" />
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {recentEvents.map((event) => (
                  <button
                    key={event}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left
                      text-xs text-white/30 hover:text-white/60 hover:bg-white/[0.04]
                      transition group"
                  >
                    <Clock
                      size={13}
                      className="shrink-0 text-white/20 group-hover:text-[#F97316] transition"
                    />
                    <span className="truncate">{event}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="px-5 py-4 border-t border-white/[0.06]">
            <p className="text-[10px] text-white/15 text-center">EventHub v1.0</p>
          </div>
        )}
      </aside>

      {/* Mobile backdrop */}
      {!collapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;
export type { SidebarSection };
