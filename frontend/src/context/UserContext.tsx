import { createContext } from "react";
import type {UserContextType } from "../types/userContextType";

export const UserContext = createContext<UserContextType | null>(null)


