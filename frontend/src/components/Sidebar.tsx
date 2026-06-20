import React, { useState } from "react";
import {
  Home,
  CalendarDays,
  Sparkles,
  GraduationCap,
  Laptop,
  ChevronRight,
  Menu,
  X,
  Link2,
} from "lucide-react";

type SidebarSection = "home" | "myevents" | "joinevent";

type SidebarProps = {
  activeSection: SidebarSection;
  setActiveSection: (section: SidebarSection) => void;
  onMyEventsClick?: () => void;
};

const recentEvents: { label: string; icon: React.ReactNode }[] = [
  { label: "KU Annual Fest", icon: <Sparkles size={14} /> },
  { label: "Convocation", icon: <GraduationCap size={14} /> },
  { label: "Hackathon #4", icon: <Laptop size={14} /> },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  onMyEventsClick,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems: {
    label: string;
    key: SidebarSection;
    icon: React.ReactNode;
  }[] = [
    { label: "Home", key: "home", icon: <Home size={18} /> },
    { label: "My events", key: "myevents", icon: <CalendarDays size={18} /> },
    { label: "Join event", key: "joinevent", icon: <Link2 size={18} /> },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#232323] border border-white/10 text-white p-2 rounded-lg shadow-lg"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          bg-[#232323] text-white flex flex-col
          border-r border-white/[0.06]
          transition-all duration-300 ease-in-out shrink-0
          fixed md:relative z-40 h-full md:h-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-[64px]" : "md:w-60"}
          w-60
        `}
        style={{ minHeight: "100vh" }}
      >
        {/* Header */}
        <div
          className={`
            flex items-center border-b border-white/[0.06]
            h-[56px] px-4 gap-3
            ${collapsed ? "justify-center" : "justify-between"}
          `}
        >
          {!collapsed && (
            <span className="font-semibold text-[17px] tracking-tight text-white select-none">
              Spot<span className="text-[#F97316]">Me</span>
            </span>
          )}

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg
              text-white/25 hover:text-white/60 hover:bg-white/[0.06]
              transition-all duration-150"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight
              size={15}
              className={`transition-transform duration-300 ${
                collapsed ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 pt-4 pb-4">
          {!collapsed && (
            <p className="text-[10.5px] font-semibold uppercase tracking-widest text-white/35 px-3 mb-1.5">
              Menu
            </p>
          )}

          {/* Nav */}
          <nav className="flex flex-col gap-0.5">
            {menuItems.map(({ label, key, icon }) => {
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveSection(key);
                    setMobileOpen(false);
                    if (key === "myevents" && onMyEventsClick) {
                      onMyEventsClick();
                    }
                  }}
                  title={collapsed ? label : undefined}
                  className={`
                    flex items-center gap-3 rounded-xl w-full text-left
                    text-[14.5px] transition-all duration-150
                    ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5"}
                    ${
                      isActive
                        ? "bg-[#2E2E2E] text-white font-semibold"
                        : "text-white/50 hover:text-white/85 hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <span
                    className={`shrink-0 ${
                      isActive ? "text-white" : "text-white/45"
                    }`}
                  >
                    {icon}
                  </span>
                  {!collapsed && <span>{label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Recent */}
          <div className="mt-6">
            {!collapsed && (
              <p className="text-[10.5px] font-semibold uppercase tracking-widest text-white/35 px-3 mb-1.5">
                Recent
              </p>
            )}

            {collapsed ? (
              <div className="flex flex-col items-center gap-1 mt-1">
                {recentEvents.map(({ label, icon }) => (
                  <button
                    key={label}
                    title={label}
                    className="flex items-center justify-center w-full py-2.5
                      text-white/30 hover:text-white/65 hover:bg-white/[0.05]
                      rounded-xl transition-all duration-150"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {recentEvents.map(({ label, icon }) => (
                  <button
                    key={label}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl w-full text-left
                      text-[13.5px] text-white/45 hover:text-white/75 hover:bg-white/[0.05]
                      transition-all duration-150 group"
                  >
                    <span className="shrink-0 text-white/30 group-hover:text-white/55 transition-colors duration-150">
                      {icon}
                    </span>
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="px-5 py-3 border-t border-white/[0.06]">
            <p className="text-[10px] text-white/15 text-center select-none">
              SpotMe v1.0
            </p>
          </div>
        )}
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
export type { SidebarSection };