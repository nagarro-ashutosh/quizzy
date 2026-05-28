"use client";
import React, { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { useParams } from "next/navigation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import {
  getQuestionById,
  getSubmissionById,
  getTestById,
  getUserName,
  optionLabel,
} from "@/shared/storage";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DetailCard from "./components/DetailCard";
const ResultPage = () => {
  const { submissionId } = useParams();

  const [copied, setCopied] = useState(false);

  const submission = useMemo(
    () => getSubmissionById(submissionId),
    [submissionId],
  );
  const test = getTestById(submissionId);
  const participantName = submission
    ? getUserName(submission.participantId)
    : "";

  const shareUrl = `${window.location.origin}/share/results/${submission?.id}`;

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };
  return (
    <>
      <PageHeader
        title={test?.title}
        action={
          <Button
            variant="outlined"
            startIcon={copied ? <DoneIcon /> : <ContentCopyIcon />}
            onClick={() => void copyShareLink()}
          >
            {copied ? "Copied" : "Share"}
          </Button>
        }
      />

      <Box
        component={"section"}
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
        <DetailCard title={"Participant"} value={participantName} />
        <DetailCard
          title={"Score"}
          value={`${submission?.score}/${submission?.total}`}
          tone={submission?.passed ? "success" : "error"}
        />
        <DetailCard
          title="Time taken"
          value={submission?.timeTakenSeconds.toString()}
        />
      </Box>
      <Card component="section">
        <CardContent sx={{ p: 0 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ justifyContent: "space-between", p: 3, pb: 1 }}
          >
            <Typography variant="h2">Breakdown</Typography>
            <Chip
              label={submission?.passed ? "Passed" : "Failed"}
              color={submission?.passed ? "success" : "error"}
            />
          </Stack>
          <Box sx={{ overflowX: "auto" }}>
            <Table aria-label="Per question result">
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Your answer</TableCell>
                  <TableCell>Correct answer</TableCell>
                  <TableCell>Outcome</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submission?.breakdown.map((item) => {
                  const question = getQuestionById(item.questionId);
                  const selectedLabel =
                    question && item.selected
                      ? `${item.selected}. ${optionLabel(question, item.selected)}`
                      : "Not answered";
                  const correctLabel = question
                    ? `${item.correct}. ${optionLabel(question, item.correct)}`
                    : item.correct;

                  return (
                    <TableRow key={item.questionId}>
                      <TableCell>
                        {question?.question ?? item.questionId}
                      </TableCell>
                      <TableCell>{selectedLabel}</TableCell>
                      <TableCell>{correctLabel}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.isCorrect ? "Correct" : "Incorrect"}
                          color={item.isCorrect ? "success" : "error"}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default ResultPage;
