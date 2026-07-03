import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import RouterErrorElement from './pages/PageNotFound';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import MyEvents from './pages/MyEvent';
import JoinEvent from './pages/JoinEvent';
import EventDetails from './pages/EventDetails';
import JoinEventRedirect from './pages/JoinEventRedirect';
import { useProfile, type zuContextType } from './context/zuContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicOnlyRoute } from './routes/PublicRoute';

function App() {
  const loggedIn = useProfile((s: zuContextType) => s.loggedIn);
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="myevents" element={<MyEvents userId="current-user-id" />} />
          <Route path="joinevent" element={<JoinEvent />} />
          <Route path="event/:eventId" element={<EventDetails />} />
        </Route>
      </Route>

      <Route path="/join/:code" element={<JoinEventRedirect />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage loggedIn={false} />} />
        <Route path="/signup" element={<LoginPage loggedIn={false} />} />
      </Route>

      <Route path="/" element={loggedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />} />

      <Route path="*" element={<RouterErrorElement />} />
    </Routes>
  );
}

export default App;
