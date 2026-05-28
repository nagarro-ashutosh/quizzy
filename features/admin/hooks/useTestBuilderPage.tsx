"use client";
import { TestFormValues } from "../types/TestBuilderPage.types";
import { useMemo, useState } from "react";
import { createTest, getQuestions } from "@/shared/storage";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { UseTestBuilderPageType } from "../types/useTestBuilderPage.types";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Checkbox } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
const defaultValues: TestFormValues = {
  title: "",
  timeLimitMinutes: 1,
  passPercentage: 1,
  expiryDate: "",
  questionIds: [],
};
const useTestBuilderPage: UseTestBuilderPageType = ({ handleViewOptions }) => {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TestFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const router = useRouter();
  const questions = useMemo(() => {
    return getQuestions();
  }, []);

  const categories = [...new Set([...questions?.map((val) => val.category)])];

  // == filter the question based upon the category

  const filteredQuestions =
    categoryFilter === "All"
      ? questions
      : questions.filter((question) => question.category === categoryFilter);

  const currentSelectedQuestion = useWatch({
    control,
    name: "questionIds",
  });

  const getCurrentSelectedQuestions = new Set([...currentSelectedQuestion]);

  const toggleQuestion = (questionId: string) => {
    const updatedQuestions = getCurrentSelectedQuestions.has(questionId)
      ? currentSelectedQuestion.filter((id) => id !== questionId)
      : [questionId, ...currentSelectedQuestion];
    setValue("questionIds", updatedQuestions, { shouldDirty: true });
  };

  const onSubmit: SubmitHandler<TestFormValues> = (data) => {
    const payload = {
      ...data,
    };
    createTest(payload);
    router.push("/admin");
  };

  const questionColumns: GridColDef[] = [
    {
      field: "checkbox",
      headerName: "Select",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        const questionId = params.row.id;
        return (
          <Checkbox
            checked={getCurrentSelectedQuestions.has(questionId)}
            onChange={() => toggleQuestion(questionId)}
            slotProps={{
              input: {
                "aria-label": `Select question ${questionId}`,
              },
            }}
          />
        );
      },
    },
    { field: "question", headerName: "Question", width: 400, sortable: false },
    { field: "category", headerName: "Category", width: 200 },
    { field: "difficulty", headerName: "Difficulty", width: 100 },
    { field: "correct", headerName: "Correct", width: 100 },
    {
      field: "viewDetails",
      headerName: "View Options",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Button
            variant="text"
            sx={{ padding: 0 }}
            onClick={() => handleViewOptions(params.row.originalQuestion)}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  return {
    control,
    errors,
    currentSelectedQuestion,
    categoryFilter,
    filteredQuestions,
    getCurrentSelectedQuestions,
    toggleQuestion,
    setCategoryFilter,
    categories,
    handleSubmit,
    onSubmit,
    questionColumns,
  };
};

export default useTestBuilderPage;
