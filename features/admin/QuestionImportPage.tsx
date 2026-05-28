"use client";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import PageHeader from "../components/PageHeader";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { Questions } from "@/shared/types";
import { CloudDownload } from "@mui/icons-material";
import { getQuestions, upsertQuestions } from "@/shared/storage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { QUESTION_CSV_HEADERS } from "@/shared/csv";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";

const QuestionImportPage = () => {
  const workerRef = useRef<Worker | null>(null);

  const [preview, setPreview] = useState<Questions[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [savedCount, setSavedCount] = useState<number | null>(null);
  const [poolCount, setPoolCount] = useState(() => getQuestions().length);

  const handleSave = () => {
    const nextQuestions = upsertQuestions(preview);
    setPoolCount(nextQuestions.length);
    setSavedCount(preview.length);
  };
  const handleUpload = async (file: File) => {
    setIsParsing(true);
    const fileText = await file.text();

    workerRef.current?.terminate();

    const worker = new Worker(
      new URL("../../workers/csvParser.worker.ts", import.meta.url),
      {
        type: "module",
      },
    );

    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent) => {
      console.log("=====response from worker", event.data);

      setPreview(event.data.questions);
      setErrors(event.data.errors);
      setIsParsing(false);
    };

    worker.onerror = (error) => {
      console.error("=====worker error", error);

      setErrors(["Unable to parse this CSV file."]);
      setIsParsing(false);
    };

    const payload = {
      fileText,
    };

    worker.postMessage(payload);

    console.log("======message sent to worker");
  };

  console.log("====errors", errors);

  const questionColumns: GridColDef[] = [
    { field: "id", headerName: "Id", width: 100, sortable: false },
    { field: "question", headerName: "Question", width: 400, sortable: false },
    { field: "correct", headerName: "Correct", width: 200 },
    { field: "category", headerName: "Category", width: 100 },
    { field: "difficulty", headerName: "Difficulty", width: 100 },
  ];
  const finalRows = useMemo(() => {
    if (!preview) return [""];

    return preview.map((question: Questions) => {
      return {
        id: question.id,
        question: question.question,
        correct: question.correct,
        category: question.category,
        difficulty: question.difficulty,
      };
    });
  }, [preview]);

  return (
    <>
      <PageHeader
        title="Question upload"
        description="CSV rows are parsed in a Web Worker and sanitized before they enter the question pool."
      />

      <Box
        component={"section"}
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "360px minmax(0, 1fr)" },
        }}
      >
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h2">Import</Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  aria-label="Upload CSV question file"
                  color="secondary"
                >
                  Select CSV
                  <input
                    hidden
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        handleUpload(file);
                      }
                    }}
                  />
                </Button>
                <Button
                  href="/sample-questions.csv"
                  variant="outlined"
                  download
                  aria-label="Download sample question CSV"
                  startIcon={<CloudDownload />}
                >
                  Sample CSV
                </Button>
                <Typography sx={{ color: "text.secondary" }}>
                  Question pool: {poolCount}
                </Typography>
                <Typography
                  component="code"
                  sx={{
                    bgcolor: "#eef3f4",
                    borderRadius: 1,
                    color: "text.primary",
                    display: "block",
                    fontSize: "0.82rem",
                    p: 1.5,
                    whiteSpace: "normal",
                  }}
                >
                  {QUESTION_CSV_HEADERS.join(", ")}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          {errors.length > 0 ? (
            <Alert severity="error" role="alert">
              <Typography sx={{ fontWeight: 800 }}>Invalid CSV</Typography>
              <Box component="ul" sx={{ m: 0, pl: 3 }}>
                {errors.slice(0, 6).map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </Box>
            </Alert>
          ) : null}
          {savedCount !== null ? (
            <Alert icon={<CheckCircleIcon />} severity="success" role="status">
              Saved {savedCount} sanitized questions.
            </Alert>
          ) : null}
        </Stack>
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                p: 3,
                pb: 1,
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h2">Preview</Typography>
                <Chip
                  label={
                    isParsing ? "Parsing in worker" : `${preview.length} rows`
                  }
                  color={errors.length > 0 ? "error" : "secondary"}
                  sx={{ width: "fit-content" }}
                />
              </Stack>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={
                  preview.length === 0 || errors.length > 0 || isParsing
                }
              >
                Save to pool
              </Button>
            </Stack>
            <Box sx={{ overflowX: "auto" }}>
              <DataGrid
                rows={finalRows}
                disableColumnFilter
                disableColumnMenu
                disableColumnResize
                columns={questionColumns}
                pagination
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                      page: 0,
                    },
                  },
                }}
                pageSizeOptions={[10, 20, 50]}
                slots={{
                  noRowsOverlay: () => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        py: 4,
                      }}
                    >
                      <Typography sx={{ color: "text.secondary" }}>
                        {isParsing ? "Parsing CSV..." : "No preview rows yet."}
                      </Typography>
                    </Box>
                  ),
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default QuestionImportPage;
