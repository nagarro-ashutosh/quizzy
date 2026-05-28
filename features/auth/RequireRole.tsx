"use client";

import { Alert, Button, Stack, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import type { Role } from "../../shared/types";
import { useAuth } from "./hooks/useAuth";
import { AuthContextValue } from "./context/auth-context";

interface RequireRoleProps {
  role: Role;
  children: ReactNode;
}
/**
 *
 * @param param0 this function check the user data is ready or not and also check secondsUntilExpiry
 *
 * @returns JSX Alert box
 */
export function RequireRole({ role, children }: RequireRoleProps) {
  const { session, isReady, logout, secondsUntilExpiry } =
    useAuth() as AuthContextValue;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (secondsUntilExpiry <= 0) {
      logout("expired");
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isReady, logout, pathname, router, secondsUntilExpiry, session]);

  if (!isReady || !session) {
    return (
      <Alert severity="info" role="status">
        Checking your session...
      </Alert>
    );
  }

  if (secondsUntilExpiry <= 0) {
    return (
      <Alert severity="warning" role="alert">
        Your session expired. Redirecting to login.
      </Alert>
    );
  }

  if (session.role !== role) {
    return (
      <Stack spacing={2} role="alert" sx={{ maxWidth: 620 }}>
        <Alert severity="error">
          This signed-in role cannot open the requested workspace.
        </Alert>
        <Typography variant="h1">Access restricted</Typography>
        <Button variant="contained" onClick={() => logout()}>
          Sign in with another role
        </Button>
      </Stack>
    );
  }

  return children;
}
