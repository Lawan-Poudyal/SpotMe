import React, { useEffect, useContext, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Sidebar from "../components/Sidebar";
import ResponsiveAppBar from "../components/Navbar"; // ✅ ADD THIS
import type { SidebarSection } from "../components/Sidebar";

const Dashboard: React.FC = () => {
  const userInfo = useContext(UserContext);
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
    if (!userInfo?.contextState?.loggedIn) {
      navigate("/signup", { replace: true });
    }
  }, [userInfo?.contextState?.loggedIn, navigate]);

  if (!userInfo?.contextState?.loggedIn) return null;

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