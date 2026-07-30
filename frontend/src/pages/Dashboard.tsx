import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ResponsiveAppBar from '../components/Navbar';
import type { SidebarSection } from '../components/Sidebar';
import type { zuContextType } from '../context/zuContext';
import { useProfile } from '../context/zuContext';

const Dashboard = () => {
  const loggedIn = useProfile((s: zuContextType) => s.loggedIn);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getSectionFromPath = (): SidebarSection => {
    if (location.pathname.includes('myevents')) return 'myevents';
    if (location.pathname.includes('joinevent')) return 'joinevent';
    return 'home';
  };
  const activeSection = getSectionFromPath();

  useEffect(() => {
    if (!loggedIn) {
      navigate('/signup', { replace: true });
    }
  }, [loggedIn, navigate]);

  return (
    <div className="flex flex-col h-screen bg-[#1C1C1E]">
      <ResponsiveAppBar onMenuClick={() => setMobileOpen((o) => !o)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          activeSection={activeSection}
          setActiveSection={(section) => {
            setMobileOpen(false);
            navigate(`/dashboard/${section}`);
          }}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
