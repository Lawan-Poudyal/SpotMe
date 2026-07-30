import { Home, CalendarDays, Link2, X } from 'lucide-react';

export type SidebarSection = 'home' | 'myevents' | 'joinevent';

interface SidebarProps {
  activeSection: SidebarSection;
  setActiveSection: (section: SidebarSection) => void;
  onMyEventsClick?: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}
const recentEvents: { label: string; icon: React.ReactNode }[] = [
  // your existing recentEvents array
];

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  onMyEventsClick,
  mobileOpen,
  setMobileOpen,
}) => {
  const collapsed = false;

  const menuItems: { label: string; key: SidebarSection; icon: React.ReactNode }[] = [
    { label: 'Home', key: 'home', icon: <Home size={18} /> },
    { label: 'My events', key: 'myevents', icon: <CalendarDays size={18} /> },
    { label: 'Join event', key: 'joinevent', icon: <Link2 size={18} /> },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
    bg-[#232323] text-white flex flex-col
    border-r border-white/6
    shrink-0
    md:relative md:translate-x-0
    ${collapsed ? 'md:w-16' : 'md:w-60'}
    w-60
    ${mobileOpen ? 'fixed z-40 h-full translate-x-0' : 'hidden md:flex'}
  `}
        style={{ minHeight: '100vh' }}
      >
        <div className="md:hidden flex items-center justify-between px-3 pt-3 pb-1">
          <span className="text-[10.5px] font-semibold uppercase tracking-widest text-white/35">
            Menu
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/40 hover:text-white/80 p-1"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}

        <nav className="flex flex-col gap-0.5">
          {menuItems.map(({ label, key, icon }) => {
            const isActive = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveSection(key);
                  setMobileOpen(false);
                  if (key === 'myevents' && onMyEventsClick) {
                    onMyEventsClick();
                  }
                }}
                title={collapsed ? label : undefined}
                className={`
                    flex items-center gap-3 rounded-xl w-full text-left
                    cursor-pointer
                    text-[14.5px]
                    ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
                    ${
                      isActive
                        ? 'bg-[#2E2E2E] text-white font-semibold'
                        : 'text-white/50 hover:text-white/85 hover:bg-white/5'
                    }
                  `}
              >
                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-white/45'}`}>
                  {icon}
                </span>
                {!collapsed && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* <div className="mt-6"> */}
        {/* {!collapsed && ( */}
        {/*   <p className="text-[10.5px] font-semibold uppercase tracking-widest text-white/35 px-3 mb-1.5"> */}
        {/*     Recent */}
        {/*   </p> */}
        {/* )} */}
        {/**/}
        {/*   {collapsed ? ( */}
        {/*     <div className="flex flex-col items-center gap-1 mt-1"> */}
        {/*       {recentEvents.map(({ label, icon }) => ( */}
        {/*         <button */}
        {/*           key={label} */}
        {/*           title={label} */}
        {/*           className="flex items-center justify-center w-full py-2.5 */}
        {/*               text-white/30 hover:text-white/65 hover:bg-white/5 */}
        {/*               rounded-xl" */}
        {/*         > */}
        {/*           {icon} */}
        {/*         </button> */}
        {/*       ))} */}
        {/*     </div> */}
        {/*   ) : ( */}
        {/*     <div className="flex flex-col gap-0.5"> */}
        {/*       {recentEvents.map(({ label, icon }) => ( */}
        {/*         <button */}
        {/*           key={label} */}
        {/*           className="flex items-center gap-3 px-3 py-2 rounded-xl w-full text-left */}
        {/*               text-[13.5px] text-white/45 hover:text-white/75 hover:bg-white/5 group" */}
        {/*         > */}
        {/*           <span className="shrink-0 text-white/30 group-hover:text-white/55">{icon}</span> */}
        {/*           <span className="truncate">{label}</span> */}
        {/*         </button> */}
        {/*       ))} */}
        {/*     </div> */}
        {/*   )} */}
        {/* </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
