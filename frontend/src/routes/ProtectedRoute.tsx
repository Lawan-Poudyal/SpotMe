import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useProfile } from '../context/zuContext';
import type { zuContextType } from '../context/zuContext';

export function ProtectedRoute() {
  const loggedIn = useProfile((s: zuContextType) => s.loggedIn);
  const location = useLocation();

  if (!loggedIn) {
    const target = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(target)}`} replace />;
  }

  return <Outlet />;
}
