import { useParams, Navigate } from 'react-router-dom';
import { useProfile } from '../context/zuContext';
import type { zuContextType } from '../context/zuContext';

export default function JoinEventRedirect() {
  const { code } = useParams();
  const isLoggedIn = useProfile((s: zuContextType) => s.loggedIn);

  if (!code) {
    return <Navigate to="/" replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(`/join/${code}`)}`} replace />;
  }

  return <Navigate to={`/dashboard/joinevent?code=${encodeURIComponent(code)}`} replace />;
}
