import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import ResponsiveAppBar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import type { SidebarSection } from "../components/Sidebar";
import type { zuContextType } from "../context/zuContext";
import { useProfile } from "../context/zuContext";

const Dashboard: React.FC = () => {
  const loggedIn = useProfile((s:zuContextType) => s.loggedIn)
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SidebarSection>("home");

  useEffect(() => {
    if (!loggedIn) {
      navigate("/signup", { replace: true });
    }
  }, [loggedIn, navigate]);

  if (!loggedIn) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F4F5F7",
      }}
    >
      <ResponsiveAppBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        {/* Main content: pass activeSection down via context or props as needed */}
        <main className="flex-1 overflow-y-auto md:ml-0">
          <Outlet context={{ activeSection }} />
        </main>
      </div>
    </Box>
  );
};

export default Dashboard;
