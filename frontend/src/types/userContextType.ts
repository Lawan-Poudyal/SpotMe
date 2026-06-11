export type UserContextPayloadType = {
  loggedIn: boolean;
  id: string;
  email: string;
  userName : string;
  emailVerified : boolean;
  profilePicLink: string | null;
};
export type UserContextType = {
  contextState: UserContextPayloadType | null;
  setContextState: React.Dispatch<React.SetStateAction<UserContextPayloadType | null>>;
};
