import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Box } from "@mui/material";
import ResponsiveAppBar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import type { SidebarSection } from "../components/Sidebar";

const Dashboard: React.FC = () => {
  const userInfo = useContext(UserContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SidebarSection>("home");

  useEffect(() => {
    if (!userInfo?.contextState?.loggedIn) {
      navigate("/signup", { replace: true });
    }
  }, [userInfo?.contextState?.loggedIn, navigate]);

  if (!userInfo?.contextState?.loggedIn) return null;

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
