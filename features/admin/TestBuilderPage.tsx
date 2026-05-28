"use client";
import PageHeader from "../components/PageHeader";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { DataGrid } from "@mui/x-data-grid";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import useTestBuilderPage from "./hooks/useTestBuilderPage";
import { useMemo, useState } from "react";
import ViewQuestion from "./components/ViewQuestion.modal";
import { Questions } from "@/shared/types";

const TestBuilderPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [question, setQuestion] = useState<Questions | null>(null);
  const currentDateTime = new Date().toISOString().slice(0, 16);
  const handleViewOptions = (question: Questions) => {
    setShowModal(true);
    setQuestion(question);
  };

  const {
    control,
    errors,
    currentSelectedQuestion,
    categoryFilter,
    filteredQuestions,
    questionColumns,
    setCategoryFilter,
    categories,
    handleSubmit,
    onSubmit,
  } = useTestBuilderPage({ handleViewOptions });

  const finalRows = useMemo(() => {
    if (!filteredQuestions) return [];

    return filteredQuestions.map((question: Questions) => {
      return {
        id: question.id,
        question: question.question,
        category: question.category,
        difficulty: question.difficulty,
        correct: question.correct,
        originalQuestion: question,
      };
    });
  }, [filteredQuestions]);

  return (
    <>
      <PageHeader title="Admin" description="Create Tests" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: "500px minmax(0, 1fr)",
          }}
        >
          <Stack spacing={2} component={"section"}>
            <Card>
              <CardContent>
                <Stack spacing={2.5}>
                  <Typography component={"h2"}>Settings</Typography>

                  <Controller
                    name="title"
                    control={control}
                    rules={{
                      required: "Title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Title should be less than 100",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        name="title"
                        label="Test tittle"
                        placeholder="Enter the title of text"
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    )}
                  />

                  <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                    <Controller
                      name="timeLimitMinutes"
                      control={control}
                      rules={{
                        required: "Time limit is required",
                        min: {
                          value: 1,
                          message: "Time limit must be at least 1 minute",
                        },
                        max: {
                          value: 120,
                          message: "Maximum value is 120",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Time limit(min)"
                          type="number"
                          error={!!errors.timeLimitMinutes}
                          helperText={errors.timeLimitMinutes?.message}
                          slotProps={{
                            inputLabel: { shrink: true },
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="passPercentage"
                      control={control}
                      rules={{
                        required: "Passing percentage is required",
                        min: {
                          value: 1,
                          message: "Minimum value is 1",
                        },
                        max: {
                          value: 100,
                          message: "Maximum value is 100",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Passing Percentage"
                          fullWidth
                          slotProps={{ htmlInput: { min: 1, max: 100 } }}
                          error={!!errors.passPercentage}
                          helperText={errors.passPercentage?.message}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </Stack>
                  <Controller
                    name="expiryDate"
                    control={control}
                    rules={{
                      required: "Expiry date is required",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="datetime-local"
                        label="Expiry Date"
                        fullWidth
                        slotProps={{
                          htmlInput: { min: currentDateTime },
                          inputLabel: { shrink: true },
                        }}
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate?.message}
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    size="large"
                    startIcon={<AddTaskIcon />}
                  >
                    Create test
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Card component={"section"}>
            <CardContent>
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
                <Stack spacing={1}>
                  <Typography variant="h2">Questions</Typography>
                  <Chip label={`${currentSelectedQuestion?.length} selected`} />
                </Stack>
                <TextField
                  select
                  label="Category"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {categories.map((category, i) => (
                    <MenuItem key={category + i} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Box sx={{ overflowX: "auto" }}>
                {errors.questionIds && currentSelectedQuestion?.length == 0 && (
                  <Box>
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {errors.questionIds.message}
                    </Alert>
                  </Box>
                )}
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
                  hideFooterSelectedRowCount={true}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </form>
      {question && (
        <ViewQuestion
          show={showModal}
          question={question}
          handleCloseModal={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default TestBuilderPage;
