export type Role = "admin" | "participant";
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
}
export type AnswerKey = "A" | "B" | "C" | "D";
export type Difficulty = "Easy" | "Medium" | "Hard";

export type TestStatus = "Pending" | "Attempted" | "Expired";

export interface AuthSession {
  token: string;
  role: Role;
  userId: string;
  name: string;
  expiresAt: number;
}

export interface AssessmentTest {
  id: string;
  title: string;
  questionIds: string[];
  timeLimitMinutes: number;
  passPercentage: number;
  createdAt: string;
  expiresAt: string;
}

export interface SubmissionBreakdown {
  questionId: string;
  selected: AnswerKey | null;
  correct: AnswerKey;
  isCorrect: boolean;
}

export interface Submission {
  id: string;
  testId: string;
  participantId: string;
  answers: Record<string, AnswerKey>;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  timeTakenSeconds: number;
  breakdown: SubmissionBreakdown[];
}
export interface Questions {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: string;
  category: string;
  difficulty: string;
}
