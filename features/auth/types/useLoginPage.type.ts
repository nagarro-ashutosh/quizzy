import { Role } from "@/shared/types";
import { Dispatch, SetStateAction, SubmitEvent } from "react";

export interface BaseDetails {
  email: string;
  password: string;
}

export interface AdminDetails extends BaseDetails {
  loginTime?: string;
}

export interface ParticipantDetails {
  p_email: string;
  p_password: string;
}

export type handleRoleChangeType = (nextRole: Role) => void;
export type HandleChangeHandler = (
  value: EventTarget & (HTMLInputElement | HTMLTextAreaElement),
) => void;

export type HandleFormSubmitType = (e: SubmitEvent<HTMLFormElement>) => void;

export interface UseLoginPageReturnValue {
  handleSubmit: HandleFormSubmitType;
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
  handleRoleChange: handleRoleChangeType;
  handleChangeAdminForm: HandleChangeHandler;
  adminDetails: AdminDetails | null;
  participantDetails: ParticipantDetails;
  handleParticipantChange: HandleChangeHandler;
  error: string;
  expiredAlert: boolean;
}

export type UseLoginPageReturnType = () => UseLoginPageReturnValue;
