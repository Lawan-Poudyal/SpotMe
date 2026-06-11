import { createContext } from "react";
import type { userContext , UserContextType } from "../types/userContextType";

export const UserContext = createContext<UserContextType | null>(null)


