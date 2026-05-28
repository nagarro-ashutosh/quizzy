"use client";
import React, { ReactNode } from "react";
import AppLayout from "./AppLayout";
import { Role } from "@/shared/types";
import { RequireRole } from "../auth/RequireRole";

const ProtectedLayout = ({
  children,
  role,
}: {
  children: ReactNode;
  role: Role;
}) => {
  return (
    <RequireRole role={role}>
      <AppLayout>{children}</AppLayout>
    </RequireRole>
  );
};

export default ProtectedLayout;
