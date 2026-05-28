"use client";
import React, { ReactNode } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { usePathname } from "next/navigation";
import { AuthContextValue } from "../auth/context/auth-context";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddTaskIcon from "@mui/icons-material/AddTaskTwoTone";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/admin/questions", label: "Questions", icon: <FileUploadIcon /> },
  { to: "/admin/tests/new", label: "New Test", icon: <AddTaskIcon /> },
];
const participantLinks = [
  { to: "/participant/tests", label: "Tests", icon: <FactCheckIcon /> },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { session, secondsUntilExpiry, logout } = useAuth() as AuthContextValue;
  const pathName = usePathname();
  const links = session?.role === "admin" ? adminLinks : participantLinks;

  const minutesLeft = Math.max(0, Math.ceil(secondsUntilExpiry / 60)); // handle -tive  case

  // useEffect(() => {
  //   if (minutesLeft <= 0) {
  //     logout();
  //   }
  // }, [minutesLeft]);

  console.log(session);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        component="nav"
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 2, minHeight: 72 }}>
            <Stack
              direction={"row"}
              spacing={1}
              sx={{
                alignItems: "center",
                mr: 1,
                // flex: 1,
              }}
            >
              <MenuBookIcon color="primary" aria-hidden="true" />

              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontWeight: 700,

                  color: "inherit",
                  textDecoration: "none",
                  marginLeft: 1,
                }}
              >
                Quizzy
              </Typography>
            </Stack>

            <Stack
              direction={"row"}
              component={"ul"}
              sx={{
                listStyle: "none",
                m: 0,
                p: 0,
                flex: 1,
                gap: 1,
                alignSelf: "right",
              }}
            >
              {session &&
                links.map((link) => (
                  <Box component={"li"} key={link.label}>
                    <Link
                      href={link?.to}
                      style={{
                        textDecoration: "none",
                        color: "secondary.main",
                        display: "inline-block",
                        ...(pathName === link.to
                          ? {
                              bgcolor: "secondary.main",
                              color: "white",
                            }
                          : {}),
                      }}
                    >
                      <Button
                        key={link.label}
                        startIcon={link.icon}
                        sx={{
                          color: "secondary.main",
                          ...(pathName === link.to
                            ? {
                                bgcolor: "secondary.main",
                                color: "white",
                              }
                            : {}),
                        }}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  </Box>
                ))}
            </Stack>
            {session && (
              <Stack
                direction="row"
                spacing={1.25}
                sx={{
                  gap: 2,
                  alignItems: "center",
                  display: { xs: "none", sm: "flex" },
                }}
              >
                <Typography>{session?.name}</Typography>
                <Typography
                  aria-label={`Session expires in ${minutesLeft} minutes`}
                  sx={{ color: "text.secondary", fontSize: "0.9rem" }}
                >
                  {minutesLeft}m
                </Typography>
                <Tooltip title="Sign out">
                  <IconButton aria-label="Sign out" onClick={() => logout()}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main" maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        {children}
      </Container>
    </Box>
  );
};

export default AppLayout;
