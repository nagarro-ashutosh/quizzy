"use client";

import { bootstrapStore, getAllUsers, getParticipants } from "@/shared/storage";
import { AuthSession, Role } from "@/shared/types";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";

const SESSION_KEY = "test.auth.session";

function createToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function readSession() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const data = window.localStorage.getItem(SESSION_KEY);
    if (!data) {
      return null;
    }
    const session = JSON.parse(data) as AuthSession;
    return session.expiresAt > Date.now() ? session : null;
  } catch (err) {
    console.error("=====err", err);
    return null;
  }
}

const SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  const [isReady, setIsReady] = useState<boolean>(false);
  const [expiredAlert, setExpiredAlert] = useState(false);
  const [secondsUntilExpiry, setSecondsUntilExpiry] = useState(0);

  useEffect(() => {
    bootstrapStore();
    const timeoutId = window.setTimeout(() => {
      const savedSession = readSession();
      setSession(savedSession);

      setSecondsUntilExpiry(
        Math.max(
          0,
          Math.ceil(
            ((savedSession?.expiresAt ?? Date.now()) - Date.now()) / 1000,
          ),
        ),
      );
      setIsReady(true);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const logout = useCallback((reason?: "expired") => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_KEY);
    }
    setSession(null);
    setIsReady(true);
    setSecondsUntilExpiry(0);
    if (reason === "expired") {
      setExpiredAlert(true);
    }
  }, []);
  useEffect(() => {
    if (!session) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      const nextSeconds = Math.max(
        0,
        Math.ceil((session.expiresAt - Date.now()) / 1000),
      );
      setSecondsUntilExpiry(nextSeconds);
      if (nextSeconds <= 0) {
        logout("expired");
      }
    }, 10000);

    return () => window.clearInterval(interval);
  }, [logout, session]);

  const login = useCallback((role: Role, userId: unknown) => {
    const users = getAllUsers();
    const fallbackUser =
      role === "participant"
        ? getParticipants()[0]
        : users.find((user) => user.role === role);

    const user = users.find((item) => item.id === userId) ?? fallbackUser;
    if (!user) {
      return;
    }
    const nextSession: AuthSession = {
      token: createToken(),
      role: user?.role,
      userId: user?.id,
      name: user?.name,
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setExpiredAlert(false);
    setSecondsUntilExpiry(Math.ceil(SESSION_TTL_MS / 1000));
    setSession(nextSession);
    setIsReady(true);
  }, []);

  const value = useMemo(
    () => ({
      login,
      session,
      secondsUntilExpiry,
      isReady,
      logout,
      expiredAlert,
      clearExpiredAlert: () => setExpiredAlert(false),
    }),
    [login, session, secondsUntilExpiry, isReady, expiredAlert, logout],
  );

  return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>;
}
