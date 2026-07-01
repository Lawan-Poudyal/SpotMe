import { Navigate, Outlet } from 'react-router-dom';
import { useProfile, type zuContextType } from '../context/zuContext';

export function PublicOnlyRoute() {
  const loggedIn = useProfile((s: zuContextType) => s.loggedIn);

  if (loggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
