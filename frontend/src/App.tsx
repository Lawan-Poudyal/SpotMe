import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { LoginPage } from './pages/LoginPage';
import RouterErrorElement from './pages/PageNotFound';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import MyEvents from './pages/MyEvent';
import JoinEvent from './pages/JoinEvent';
import EventDetails from './pages/EventDetails';
import { UserContext } from './context/UserContext';

function App() {
  const { contextState } = useContext(UserContext) ?? {};
  const isLoggedIn = contextState?.loggedIn ?? false;

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Navigate to="home" replace />} />

        {/* Pages */}
        <Route path="home" element={<HomePage />} />
        <Route path="myevents" element={<MyEvents userId="current-user-id" />} />
        <Route path="joinevent" element={<JoinEvent />} />

        <Route path="event/:eventId" element={<EventDetails />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginPage loggedIn={true} />} />
      <Route path="/signup" element={<LoginPage loggedIn={false} />} />

      {/* Root */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />

      {/* 404 */}
      <Route path="*" element={<RouterErrorElement />} />
    </Routes>
  );
}

export default App;
