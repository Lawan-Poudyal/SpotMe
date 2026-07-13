import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { zuContextType } from './zuContext';
import { useProfile } from './zuContext';
import type { UserContextPayloadType } from '../types/userContextType';
import { authClient } from '../utility/auth-client';
import { SwitchCamera } from 'lucide-react';

type propType = {
  children: ReactNode;
};
type userSessionType = {
  email: string;
  emailVerified: boolean;
  image: string | null;
  name: string;
  id: string;
};

export default function AuthContext({ children }: propType) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const setProfile = useProfile((s: zuContextType) => s.setProfile);
  useEffect(() => {
    authClient
      .getSession()
      .then((data) => {
        const responseObj = data?.data?.user as userSessionType;
        const toSetPayload: UserContextPayloadType = {
          loggedIn: false,
          email: responseObj?.email,
          id: responseObj?.id,
          userName: responseObj?.name,
          emailVerified: responseObj?.emailVerified,
          profilePicLink: responseObj?.image,
        };
        if (data.data !== null) {
          toSetPayload.loggedIn = true;
        }
        setProfile(toSetPayload);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false); // however later on show the user a 500 internal errpage
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <SwitchCamera className="h-12 w-12 text-white animate-pulse" />
      </div>
    );
  }
  return <>{children}</>;
}
