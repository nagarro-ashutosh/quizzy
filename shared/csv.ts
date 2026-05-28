import { Questions } from "./types";

export const QUESTION_CSV_HEADERS = [
  "id",
  "question",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correct",
  "category",
  "difficulty",
] as const;

export interface CsvParseResult {
  questions: Questions[];
  errors: string[];
}
