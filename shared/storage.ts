import { TestFormValues } from "@/features/admin/types/TestBuilderPage.types";
import { mockLoginUsers, seedQuestions, seedTests } from "./mock-data";
import {
  AnswerKey,
  AssessmentTest,
  Questions,
  Submission,
  SubmissionBreakdown,
  TestStatus,
} from "./types";
import moment from "moment";
import { ParamValue } from "next/dist/server/request/params";

const QUESTIONS_KEY = "oap.questions";
const TESTS_KEY = "oap.tests";
const SUBMISSIONS_KEY = "oap.submissions";

export function getAllUsers() {
  return mockLoginUsers;
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function bootstrapStore() {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.localStorage.getItem(QUESTIONS_KEY)) {
    writeJson(QUESTIONS_KEY, seedQuestions);
  }

  if (!window.localStorage.getItem(TESTS_KEY)) {
    writeJson(TESTS_KEY, seedTests);
  }

  if (!window.localStorage.getItem(SUBMISSIONS_KEY)) {
    writeJson(SUBMISSIONS_KEY, []);
  }
}

function readJsonFromLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  const raw = window?.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}
export function getParticipants() {
  return mockLoginUsers.filter((user) => user.role === "participant");
}

export function getTests() {
  return readJsonFromLocal<AssessmentTest[]>(TESTS_KEY, seedTests);
}

export function getQuestions() {
  return readJsonFromLocal<Questions[]>(QUESTIONS_KEY, seedQuestions);
}

export function getSubmission() {
  return readJsonFromLocal<Submission[]>(SUBMISSIONS_KEY, []);
}

export const getDashboardMetrics = () => {
  const tests = getTests();
  const submissions = getSubmission();
  const passed = submissions.filter((submission) => submission.passed).length;
  const failed = submissions.filter(
    (submission) => submission.passed == false,
  ).length;

  return {
    testsCreated: tests.length,
    submissionCount: submissions.length,
    passed,
    failed,

    passRatio:
      submissions.length > 0
        ? Math.round((passed / submissions.length) * 100)
        : 0,
  };
};
export const formattedDate = (date: string) => {
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(date));

  const finalOutput = formattedDate.replace(" at ", ", ").toLowerCase();
  return finalOutput;
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTest(input: TestFormValues) {
  const newTest: AssessmentTest = {
    id: createId("test"),
    title: input.title,
    questionIds: input.questionIds,
    timeLimitMinutes: input.timeLimitMinutes,
    passPercentage: input.passPercentage,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(input.expiryDate).toISOString(),
  };

  saveTests([newTest, ...getTests()]);
  return newTest;
}
export function saveTests(nextTests: AssessmentTest[]) {
  writeJson(TESTS_KEY, nextTests);
}

export function saveQuestions(nextQuestions: Questions[]) {
  writeJson(QUESTIONS_KEY, nextQuestions);
}

export function upsertQuestions(incomingQuestions: Questions[]) {
  const existing = getQuestions();
  const byId = new Map(existing.map((question) => [question.id, question]));

  incomingQuestions.forEach((question) => {
    byId.set(question.id, question);
  });

  const merged = Array.from(byId.values()).sort((first, second) =>
    first.id.localeCompare(second.id),
  );
  saveQuestions(merged);
  return merged;
}

export function getAssignedTests() {
  return getTests();
}

export function getSubmissions() {
  return readJsonFromLocal<Submission[]>(SUBMISSIONS_KEY, []);
}

export function getSubmissionForTest(testId: string, participantId: string) {
  return getSubmissions().find(
    (submission) =>
      submission.testId === testId &&
      submission.participantId === participantId,
  );
}

export function getTestStatus(test: AssessmentTest, participantId: string) {
  const submission = getSubmissionForTest(test.id, participantId);
  if (submission) {
    return "Attempted" satisfies TestStatus;
  }

  if (moment().isSameOrAfter(test.expiresAt)) {
    return "Expired" satisfies TestStatus;
  }

  return "Pending" satisfies TestStatus;
}

export const getTestById = (testId: ParamValue) => {
  return getTests().find((val) => val.id === testId);
};

export function getQuestionsForTest(test: AssessmentTest) {
  const byId = new Map(
    getQuestions().map((question) => [question.id, question]),
  );
  return test.questionIds.flatMap((questionId) => {
    const question = byId.get(questionId);
    return question ? [question] : [];
  });
}

export const optionLabel = (question: Questions, answer: AnswerKey) => {
  const mapper = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  };
  return mapper[answer];
};

export function formatTime(seconds: number) {
  const duration = moment.duration(seconds, "seconds");

  const minutes = Math.floor(duration.asMinutes());
  const remainingSeconds = duration.seconds();

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}
export function saveSubmissions(nextSubmissions: Submission[]) {
  writeJson(SUBMISSIONS_KEY, nextSubmissions);
}

export const submitTest = ({
  test,
  participantId,
  answers,
  startedAt,
}: {
  test: AssessmentTest;
  participantId: string;
  answers: Record<string, AnswerKey>;
  startedAt: string;
}) => {
  // 1 get question for test
  const questions = getQuestionsForTest(test);
  // now checking the question is this correct or not
  const mapping: SubmissionBreakdown[] = questions.map((question) => {
    const isSelected = answers[question.id];
    return {
      questionId: question.id,
      selected: isSelected as AnswerKey,
      correct: question.correct as AnswerKey,
      isCorrect: isSelected === question.correct,
    };
  });

  const score = mapping.filter((item) => item.isCorrect).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const submittedAt = moment();
  const started = startedAt;
  const submission: Submission = {
    id: createId("submission"),
    testId: test.id,
    participantId: participantId,
    answers: answers,
    score,
    total,
    percentage,
    passed: percentage >= test.passPercentage,
    startedAt: started.toString(),
    submittedAt: submittedAt.toISOString(),
    timeTakenSeconds: Math.max(0, submittedAt.diff(startedAt, "seconds")),
    breakdown: mapping,
  };
  const withoutExisting = getSubmissions().filter(
    (item) => item.testId !== test.id || item.participantId !== participantId,
  );
  saveSubmissions([submission, ...withoutExisting]);
  return submission;
};

export function getSubmissionById(submissionId: ParamValue) {
  return getSubmissions().find((submission) => submission.id === submissionId);
}

export function getUserName(userId: string) {
  return (
    mockLoginUsers.find((user) => user.id === userId)?.name ?? "Unknown user"
  );
}

export function getQuestionById(questionId: string) {
  return getQuestions().find((question) => question.id == questionId);
}
