import React, { useEffect, useState } from "react";
import { Outlet, useNavigate ,useLocation} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ResponsiveAppBar from "../components/Navbar"; 
import type { SidebarSection } from "../components/Sidebar";
import type { zuContextType } from "../context/zuContext";
import { useProfile } from "../context/zuContext";

const Dashboard: React.FC = () => {
  const loggedIn = useProfile((s:zuContextType) => s.loggedIn)
  const navigate = useNavigate();
  const location = useLocation();

  const getSectionFromPath = (): SidebarSection => {
    if (location.pathname.includes("myevents")) return "myevents";
    if (location.pathname.includes("joinevent")) return "joinevent";
    return "home";
  };

  const [activeSection, setActiveSection] =
    useState<SidebarSection>(getSectionFromPath());

  useEffect(() => {
    setActiveSection(getSectionFromPath());
  }, [location.pathname]);

  useEffect(() => {
    if (!loggedIn) {
      navigate("/signup", { replace: true });
    }
  }, [loggedIn, navigate]);

  if (!loggedIn) return null;

  return (
    <div className="flex flex-col h-screen bg-[#1C1C1E]">

      {/* ✅ REAL NAVBAR WITH DROPDOWN */}
      <ResponsiveAppBar />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={(section) => {
            setActiveSection(section);
            navigate(`/dashboard/${section}`);
          }}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Dashboard;
