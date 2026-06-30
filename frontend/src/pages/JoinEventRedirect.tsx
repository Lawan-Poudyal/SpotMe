import { useParams, Navigate } from 'react-router-dom';
import { useProfile } from '../context/zuContext';
import type { zuContextType } from '../context/zuContext';

export default function JoinEventRedirect() {
  const { code } = useParams();
  const isLoggedIn = useProfile((s: zuContextType) => s.loggedIn);

  if (!isLoggedIn) {
    return <Navigate to={`/login?redirect=/join/${code}`} replace />;
  }
  return <Navigate to={`/dashboard/joinevent?code=${code}`} replace />;
}
