"use client";
import { formatTime, getTestById, optionLabel } from "@/shared/storage";
import { AnswerKey } from "@/shared/types";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";

import useTestTakinghook from "./hooks/useTestTakinghook";
import theme from "@/app/theme";
const answerKeys: AnswerKey[] = ["A", "B", "C", "D"];
function getInitialSeconds(test: ReturnType<typeof getTestById>) {
  if (!test) {
    return 0;
  }

  const expiresInSeconds = Math.max(
    0,
    Math.floor((new Date(test.expiresAt).getTime() - Date.now()) / 1000),
  );
  return Math.min(test.timeLimitMinutes * 60, expiresInSeconds);
}

const TestTakingPage = () => {
  const { testId } = useParams();

  const {
    test,
    status,
    currentIndex,
    questions,
    question,
    selected,
    setAnswer,
    moveQuestion,
    handleSubmitTest,
    answeredCount,
    setCurrentIndex,
    answers,
  } = useTestTakinghook({ testId });

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getInitialSeconds(test),
  );

  useEffect(() => {
    if (!test || status !== "Pending") {
      return undefined;
    }
    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status, test]);

  return (
    <Box
      component={"section"}
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(0, 1fr) 400px",
        },
      }}
    >
      <Stack spacing={2}>
        <Stack
          component="header"
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h2"> {test?.title}</Typography>
            <Typography sx={{ color: "text.secondary", mt: 1 }}>
              Question {currentIndex + 1} of {questions.length}
            </Typography>
          </Box>
          <Chip
            component="div"
            color={remainingSeconds < 60 ? "error" : "secondary"}
            label={`Time ${formatTime(remainingSeconds)} `}
            aria-live="polite"
            role="status"
            sx={{
              alignSelf: { xs: "flex-start", md: "center" },
              fontSize: "1rem",
            }}
          />
        </Stack>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h2">{question.question}</Typography>
              <FormControl component="fieldset">
                <FormLabel component="legend">Answer choices</FormLabel>
                <RadioGroup
                  value={selected}
                  onChange={(event) =>
                    setAnswer(event.target.value as AnswerKey)
                  }
                  aria-label={`Answers for question ${currentIndex + 1}`}
                >
                  {answerKeys.map((answer) => (
                    <FormControlLabel
                      key={answer}
                      value={answer}
                      control={<Radio />}
                      label={`${answer}.  ${optionLabel(question, answer)}`}
                      sx={{
                        alignItems: "center",
                        border: `1px solid ${theme.palette.secondary.light}`,
                        borderColor:
                          selected === answer ? "secondary.light" : "divider",
                        borderRadius: 1,
                        m: 0,
                        mb: 1,
                        minHeight: 56,
                        p: 1.25,
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ justifyContent: "space-between" }}
              >
                <Button
                  variant={"outlined"}
                  disabled={currentIndex === 0}
                  onClick={() => moveQuestion(-1)}
                  color="secondary"
                >
                  Previous
                </Button>
                {currentIndex !== questions.length - 1 ? (
                  <Button
                    variant={"contained"}
                    onClick={() => moveQuestion(+1)}
                    color="secondary"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant={"contained"}
                    onClick={handleSubmitTest}
                    color="secondary"
                  >
                    Submit
                  </Button>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
      <Card component="aside" aria-label="Question navigator">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h2">Progress</Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {answeredCount} of {questions.length} answered
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: "repeat(5, minmax(44px, 1fr))",
              }}
            >
              {questions.map((item, index) => (
                <Button
                  key={item.id}
                  variant={index === currentIndex ? "contained" : "outlined"}
                  color={answers[item.id] ? "secondary" : "inherit"}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to question ${index + 1}`}
                  sx={{
                    minWidth: 44,
                    aspectRatio: "1 / 1",
                    color:
                      index === currentIndex
                        ? theme.palette.secondary.contrastText
                        : theme.palette.secondary.main,
                    backgroundColor:
                      index === currentIndex
                        ? theme.palette.secondary.light
                        : theme.palette.secondary.contrastText,
                    border: `1px solid ${theme.palette.secondary.light}`,
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            </Box>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<SendIcon />}
              onClick={handleSubmitTest}
            >
              Submit test
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestTakingPage;
