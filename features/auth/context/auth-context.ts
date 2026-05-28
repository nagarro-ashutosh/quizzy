"use client";

import { AuthSession, Role } from "@/shared/types";
import { createContext } from "react";

export interface AuthContextValue {
  session: AuthSession | null;
  isReady: boolean;
  secondsUntilExpiry: number;
  expiredAlert: boolean;
  logout: (reason?: "expired") => void;
  //   clearExpiredAlert: () => void;
  login: (role: Role, userId?: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
