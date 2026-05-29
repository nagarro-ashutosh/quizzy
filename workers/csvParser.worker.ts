import { CsvParseResult, QUESTION_CSV_HEADERS } from "@/shared/csv";
import { AnswerKey, Difficulty, Questions } from "@/shared/types";
import Papa from "papaparse";

type CsvRow = Record<string, string>;

const answerKeys: AnswerKey[] = ["A", "B", "C", "D"];
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

function stripControlCharacters(value: string) {
  return Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("");
}

function sanitizePlainText(value: unknown, maxLength = 700) {
  if (typeof value !== "string") {
    return "";
  }
  // --Stripping Malicious Code & Markup--
  return stripControlCharacters(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeId(value: unknown) {
  return sanitizePlainText(value, 80).replace(/[^a-zA-Z0-9_-]/g, "-");
}

function normalizeAnswer(value: string): AnswerKey | null {
  const normalized = value
    .trim()
    .replace(/^option/i, "")
    .toUpperCase();
  return answerKeys.includes(normalized as AnswerKey)
    ? (normalized as AnswerKey)
    : null;
}

function normalizeDifficulty(value: string): Difficulty | null {
  const normalized = sanitizePlainText(value, 20).toLowerCase();
  return (
    difficulties.find(
      (difficulty) => difficulty.toLowerCase() === normalized,
    ) ?? null
  );
}

function validateHeaders(fields: string[] | undefined) {
  if (!fields) {
    return ["Missing CSV header row."];
  }

  return QUESTION_CSV_HEADERS.filter((header) => !fields.includes(header)).map(
    (header) => `Missing required header: ${header}`,
  );
}

function mapRows(rows: CsvRow[], fields: string[] | undefined): CsvParseResult {
  const errors = validateHeaders(fields);
  const seenIds = new Set<string>();
  const questions: Questions[] = [];

  rows.forEach((row, index) => {
    const lineNumber = index + 2;
    const id = sanitizeId(row.id);
    const correct = normalizeAnswer(row.correct ?? "");
    const difficulty = normalizeDifficulty(row.difficulty ?? "");
    const question = sanitizePlainText(row.question);
    const optionA = sanitizePlainText(row.optionA);
    const optionB = sanitizePlainText(row.optionB);
    const optionC = sanitizePlainText(row.optionC);
    const optionD = sanitizePlainText(row.optionD);
    const category = sanitizePlainText(row.category, 80);

    if (!id) {
      errors.push(`Line ${lineNumber}: id is required.`);
    }

    if (seenIds.has(id)) {
      errors.push(`Line ${lineNumber}: duplicate id "${id}".`);
    }

    if (!question || !optionA || !optionB || !optionC || !optionD) {
      errors.push(`Line ${lineNumber}: question and all options are required.`);
    }

    if (!correct) {
      errors.push(`Line ${lineNumber}: correct must be A, B, C, or D.`);
    }

    if (!category) {
      errors.push(`Line ${lineNumber}: category is required.`);
    }

    if (!difficulty) {
      errors.push(
        `Line ${lineNumber}: difficulty must be Easy, Medium, or Hard.`,
      );
    }

    if (
      id &&
      question &&
      optionA &&
      optionB &&
      optionC &&
      optionD &&
      correct &&
      category &&
      difficulty
    ) {
      seenIds.add(id);
      questions.push({
        id,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correct,
        category,
        difficulty,
      });
    }
  });

  return { questions, errors };
}
self.onmessage = (event: MessageEvent<{ fileText: string }>) => {
  const parsed = Papa.parse<CsvRow>(event.data.fileText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });
  console.log("=======sdf", parsed.meta.fields);

  const result = mapRows(parsed.data, parsed.meta.fields);
  console.log("=====result", result);

  parsed.errors.forEach((error: { message: string }) => {
    result.errors.push(`CSV parser: ${error.message}`);
  });

  self.postMessage(result);
};
