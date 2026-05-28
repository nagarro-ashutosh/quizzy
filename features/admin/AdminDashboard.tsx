"use client";
import AddTaskIcon from "@mui/icons-material/AddTask";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  formattedDate,
  getDashboardMetrics,
  getSubmission,
  getTests,
} from "@/shared/storage";
import PageHeader from "../components/PageHeader";
import Link from "next/link";
import { SxProps } from "@mui/material/styles";

const AdminDashboard = () => {
  const commonSx: SxProps = {
    backgroundColor: "secondary.main",
  };
  const metrics = getDashboardMetrics();
  const tests = getTests();
  const submissions = getSubmission();

  return (
    <Stack spacing={2}>
      <PageHeader
        title="Admin"
        description="Dashboard"
        action={
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              component={Link}
              href="/admin/questions"
              variant="contained"
              startIcon={<FileUploadIcon />}
              sx={commonSx}
            >
              Upload CSV
            </Button>
            <Button
              component={Link}
              href="/admin/tests/new"
              variant="contained"
              startIcon={<AddTaskIcon />}
              sx={commonSx}
            >
              Create test
            </Button>
          </Stack>
        }
      />
      <Box
        component="section"
        aria-label="Assessment summary"
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(4, minmax(0, 1fr))",
          },
          mb: 3,
        }}
      >
        <MatrixCard label="Tests created" value={metrics.testsCreated} />
        <MatrixCard label="Tests Submitted" value={metrics.submissionCount} />
        <MatrixCard label="Tests Passed" value={metrics.passed} />
        <MatrixCard label="Tests Failed" value={metrics.failed} />
      </Box>{" "}
      <Card component="section" sx={{ mb: 3 }}>
        <CardContent>
          <Stack spacing={1.5}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ justifyContent: "space-between" }}
            >
              <Typography variant="h2">Pass ratio</Typography>
              <Chip
                label={`${metrics.passRatio}% pass`}
                color={metrics.passRatio >= 60 ? "success" : "warning"}
              />
            </Stack>
            <LinearProgress
              variant="determinate"
              value={metrics.passRatio}
              aria-label={`Pass ratio ${metrics.passRatio} percent`}
              sx={{ height: 12, borderRadius: 1 }}
            />
          </Stack>
        </CardContent>
      </Card>
      <Card component="section">
        <CardContent>
          <Typography variant="h2">Tests</Typography>

          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Test</TableCell>
                <TableCell align="right">Questions</TableCell>
                <TableCell align="right">Expires</TableCell>
                <TableCell align="right">Total Submission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.map((test, i) => {
                const testSubmissions = submissions.filter(
                  (submission) => submission.testId === test.id,
                );
                return (
                  <TableRow
                    key={test.title + i}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="tests">
                      <Typography sx={{ fontWeight: 800 }}>
                        {test.title}
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        Pass {test.passPercentage}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {test.questionIds?.length}
                    </TableCell>

                    <TableCell align="right">
                      {formattedDate(test.expiresAt)}
                    </TableCell>
                    <TableCell align="right">
                      {testSubmissions.length}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AdminDashboard;

const MatrixCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <Card>
      <CardContent>
        <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            color: "text.primary",
            mt: 1,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};
