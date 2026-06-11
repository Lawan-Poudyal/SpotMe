import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
//import Navbar from "../components/Navbar";
import { Box } from "@mui/material";
import ResponsiveAppBar from "../components/Navbar";

const Dashboard: React.FC = () => {
  const userInfo = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.contextState?.loggedIn) {
      navigate("/signup", { replace: true });
    }
  }, [userInfo?.contextState?.loggedIn, navigate]);

  // Prevent flash of child content while redirecting
  if (!userInfo?.contextState?.loggedIn) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
	justifyContent : "center",
        backgroundColor: "#F5F5F5",
      }}
    >
      <ResponsiveAppBar/>
    <div className="flex-1 flex row">
	<Outlet/>	
    </div>
    </Box>
  );
};

export default Dashboard;
