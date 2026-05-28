import { Role } from "@/shared/types";
import { useEffect, useState } from "react";
import {
  AdminDetails,
  HandleChangeHandler,
  HandleFormSubmitType,
  handleRoleChangeType,
  ParticipantDetails,
  UseLoginPageReturnType,
} from "../types/useLoginPage.type";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { AuthContextValue } from "../context/auth-context";
import { getParticipants } from "@/shared/storage";
const adminCredentials = {
  email: "admin@example.com",
  password: "admin123",
};
const useLoginPage: UseLoginPageReturnType = () => {
  const { login, session, expiredAlert } = useAuth() as AuthContextValue;
  const router = useRouter();
  const [role, setRole] = useState<Role>("admin");
  const [error, setError] = useState("");

  const [adminDetails, setAdminDetails] = useState<AdminDetails>({
    email: "",
    password: "",
  });
  const [participantDetails, setParticipantDetails] =
    useState<ParticipantDetails>({
      p_email: "",
      p_password: "",
    });
  // To check if user session is exits or not
  useEffect(() => {
    console.log("==session", session);

    if (session) {
      router.replace(
        session.role === "admin" ? "/admin" : "/participant/tests",
      );
    }
  }, [router, session]);

  /** handle submit
   *
   * @param e form values
   * @returns
   */

  const handleSubmit: HandleFormSubmitType = (e) => {
    e.preventDefault();
    setError("");
    if (role === "admin") {
      const isValidAdmin =
        adminDetails.email.trim().toLowerCase() === adminCredentials.email &&
        adminDetails.password === adminCredentials.password;

      if (!isValidAdmin) {
        setError("Admin email or password is incorrect.");
        return;
      }
      login("admin");
      router.replace("/admin");

      return;
    }

    const getUsers = getParticipants().find(
      (val) =>
        val.email.toLocaleLowerCase() ===
          participantDetails.p_email.toLocaleLowerCase() &&
        val.password == participantDetails.p_password,
    );

    console.log("====getUsers", getUsers);

    console.log(getUsers?.id);

    if (!getUsers) {
      setError("Participant email or access code is incorrect.");
      return;
    }

    login("participant", getUsers?.id);
    router.replace(nextPath("participant") ?? "/participant/tests");
  };
  const nextPath = (nextRole: Role) => {
    if (typeof window === "undefined") {
      return null;
    }

    const requestedPath = new URLSearchParams(window.location.search).get(
      "next",
    );
    if (!requestedPath) {
      return null;
    }

    if (nextRole === "admin" && requestedPath.startsWith("/admin")) {
      return requestedPath;
    }

    if (
      nextRole === "participant" &&
      requestedPath.startsWith("/participant")
    ) {
      return requestedPath;
    }

    return null;
  };
  /**
   * Change the radio button value of the user
   * @param nextRole
   *
   */
  const handleRoleChange: handleRoleChangeType = (nextRole: Role) => {
    setRole(nextRole);
    setError("");
    // clearExpiredAlert()
  };
  /**
   * updating the form value when user type in input field
   * @param value
   *
   */
  const handleChangeAdminForm: HandleChangeHandler = (value) => {
    const { name, value: val } = value;
    setAdminDetails((prev) => ({
      ...prev,
      [name]: val,
    }));
  };
  const handleParticipantChange: HandleChangeHandler = (value) => {
    console.log("===calling", value);

    const { name, value: val } = value;
    setParticipantDetails((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  return {
    handleSubmit,
    role,
    setRole,
    handleRoleChange,
    handleChangeAdminForm,
    adminDetails,
    participantDetails,
    handleParticipantChange,
    error,
    expiredAlert,
  };
};
export default useLoginPage;
