"use client";

import React from "react";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PageHeader from "../components/PageHeader";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  getAssignedTests,
  getSubmissionForTest,
  getTestStatus,
} from "@/shared/storage";
import Link from "next/link";
import { useAuth } from "../auth/hooks/useAuth";
import { AuthContextValue } from "../auth/context/auth-context";
import moment from "moment";

const TestListPage = () => {
  const { session } = useAuth() as AuthContextValue;

  const tests = getAssignedTests();

  return (
    <>
      <PageHeader title="My tests" />
      <Box
        component="section"
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        {tests.map((test) => {
          const status =
            session?.userId && getTestStatus(test, session?.userId);

          const submission =
            session?.userId && getSubmissionForTest(test.id, session?.userId);

          return (
            <Card component="article" key={test.id}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack spacing={0.75}>
                      <Typography variant="h2">{test.title}</Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        {test.questionIds.length} questions -{" "}
                        {test.timeLimitMinutes} minutes
                      </Typography>
                    </Stack>
                    <StatusChip status={status} />
                  </Stack>
                  <Typography sx={{ color: "text.secondary" }}>
                    {status === "Expired" ? "Expired " : "Expires "}
                    {moment(test.expiresAt).format("YYYY-MM-DD HH:mm:ss")}
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    {status === "Pending" ? (
                      <Link href={`/participant/tests/${test.id}/take`}>
                        <Button
                          variant="contained"
                          startIcon={<PlayArrowIcon />}
                        >
                          Start
                        </Button>
                      </Link>
                    ) : null}
                    {status === "Attempted" && submission ? (
                      <Button
                        component={Link}
                        href={`/participant/results/${submission.id}`}
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                      >
                        Result
                      </Button>
                    ) : null}
                    {status === "Expired" ? (
                      <Button disabled startIcon={<AssignmentTurnedInIcon />}>
                        Closed
                      </Button>
                    ) : null}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </>
  );
};

function StatusChip({
  status,
}: {
  status: "" | "Pending" | "Attempted" | "Expired" | undefined;
}) {
  const color =
    status === "Attempted"
      ? "success"
      : status === "Expired"
        ? "error"
        : "primary";

  return <Chip label={status} color={color} />;
}

export default TestListPage;
