"use client";
import { AuthContextValue } from "@/features/auth/context/auth-context";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getQuestionsForTest,
  getTestById,
  getTestStatus,
  submitTest,
} from "@/shared/storage";
import { AnswerKey } from "@/shared/types";
import moment from "moment";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export default function useTestTakinghook({ testId }: { testId: ParamValue }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({});
  const { session } = useAuth() as AuthContextValue;
  const submittedRef = useRef(false);
  const router = useRouter();
  const test = useMemo(() => {
    return getTestById(testId);
  }, [testId]);

  const questions = useMemo(
    () => (test ? getQuestionsForTest(test) : []),
    [test],
  );

  const answeredCount = Object.keys(answers).length;

  const question = questions[currentIndex]; // GETTING THE QUESTION FROM LIST AND WHEN WE CLICK WE MOVE THE INDEX

  const selected = answers[question.id] ?? ""; // which options user selects
  const status =
    test && session
      ? getTestStatus(test, session.userId)
      : ("Expired" as const);

  const setAnswer = (answer: AnswerKey) => {
    setAnswers((current) => ({ ...current, [question.id]: answer }));
  };
  const moveQuestion = (direction: 1 | -1) => {
    setCurrentIndex((current) =>
      Math.min(questions.length - 1, Math.max(0, current + direction)),
    );
  };

  const handleSubmitTest = () => {
    if (!test || !session || submittedRef.current) {
      return;
    }
    submittedRef.current = true;
    const submission = submitTest({
      test,
      participantId: session.userId,
      answers,
      startedAt: moment().format(),
    });
    router.replace(`/participant/results/${submission?.id}`);
    console.log(answers);
  };
  return {
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
    answers,
    setCurrentIndex,
  };
}
