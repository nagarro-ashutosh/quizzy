"use client";
import Image from "next/image";
import { Role } from "@/shared/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Stack,
  useTheme,
  Alert,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import useLoginPage from "./hooks/useLoginPage";
import React from "react";

const LoginPage = () => {
  const theme = useTheme();
  const id = React.useId();

  // =====hooks======
  const {
    handleSubmit,
    handleRoleChange,
    role,
    handleChangeAdminForm,
    adminDetails,
    participantDetails,
    handleParticipantChange,
    error,
    expiredAlert,
  } = useLoginPage();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "grid",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Card
          component="section"
          sx={{ borderRadius: 2, boxShadow: "-3px 10px 20px 0px #7e7e7ef5" }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Image
                    src={"/logo.jpg"}
                    alt="logo "
                    width={150}
                    height={150}
                    style={{
                      borderRadius: theme.typography.pxToRem(10),
                    }}
                    loading="eager"
                  />
                </Stack>
                {expiredAlert ? (
                  <Alert severity="warning" role="alert">
                    Your session expired. Sign in again to continue.
                  </Alert>
                ) : null}
                <Typography sx={{ color: "text.secondary" }}>
                  Choose a role, and start the assessment flow.
                </Typography>
              </Stack>
              {error ? (
                <Alert severity="error" role="alert">
                  {error}
                </Alert>
              ) : null}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={1}>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby={`${id}-label`}
                      defaultValue="Role base login"
                      name="radio-buttons-group"
                      onChange={(event) =>
                        handleRoleChange(event.target.value as Role)
                      }
                      value={role}
                    >
                      <FormControlLabel
                        value="admin"
                        control={<Radio />}
                        label="Admin"
                      />
                      <FormControlLabel
                        value="participant"
                        control={<Radio />}
                        label="Participant"
                      />
                    </RadioGroup>
                  </FormControl>
                  {role === "admin" ? (
                    <>
                      <Stack
                        spacing={2}
                        component="section"
                        aria-label="Admin login"
                        sx={{
                          paddingTop: theme.spacing(3),
                        }}
                      >
                        <TextField
                          label="Admin email"
                          placeholder="Enter Email"
                          type="email"
                          name={"email"}
                          value={adminDetails?.email}
                          onChange={(event) =>
                            handleChangeAdminForm(event.target)
                          }
                          required
                        />
                        <TextField
                          label="Admin password"
                          type="password"
                          name={"password"}
                          placeholder="Enter Password"
                          value={adminDetails?.password}
                          onChange={(event) =>
                            handleChangeAdminForm(event.target)
                          }
                          required
                          autoComplete="password"
                        />
                        <Typography
                          variant="caption"
                          component={"span"}
                          sx={{ color: "text.secondary" }}
                        >
                          Demo: admin@example.com / admin123
                        </Typography>
                      </Stack>
                    </>
                  ) : (
                    <Stack
                      spacing={2}
                      component="section"
                      aria-label="Participant login"
                    >
                      <TextField
                        label="Participant email"
                        type="email"
                        value={participantDetails.p_email}
                        onChange={(event) =>
                          handleParticipantChange(event.target)
                        }
                        name="p_email"
                        required
                      />
                      <TextField
                        label="Access code"
                        type="password"
                        value={participantDetails.p_password}
                        onChange={(event) =>
                          handleParticipantChange(event.target)
                        }
                        name={"p_password"}
                        required
                      />
                      <Typography sx={{ color: "text.secondary" }}>
                        Demo access code: participant123
                      </Typography>
                    </Stack>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<LockIcon />}
                    aria-label={`Sign in as ${role}`}
                    color="secondary"
                  >
                    Sign in
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
