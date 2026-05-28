import {
  Control,
  FieldErrors,
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";
import { TestFormValues } from "./TestBuilderPage.types";
import { Questions } from "@/shared/types";
import { Dispatch, SetStateAction } from "react";
import { GridColDef } from "@mui/x-data-grid";

interface UseTestBuilderPageReturnValues {
  // control: Control<TestFormValues, any, TestFormValues>;
  control: Control<TestFormValues, FieldValues, TestFormValues>;
  errors: FieldErrors<TestFormValues>;
  currentSelectedQuestion: string[];
  categoryFilter: string;
  filteredQuestions: Questions[];
  getCurrentSelectedQuestions: Set<string>;
  toggleQuestion: (questionId: string) => void;
  setCategoryFilter: Dispatch<SetStateAction<string>>;
  categories: string[];
  handleSubmit: UseFormHandleSubmit<TestFormValues, TestFormValues>;
  onSubmit: SubmitHandler<TestFormValues>;
  questionColumns: GridColDef[];
}
interface UseTestBuilderParams {
  handleViewOptions: (question: Questions) => void;
}

export type UseTestBuilderPageType = (
  params: UseTestBuilderParams,
) => UseTestBuilderPageReturnValues;
