"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "hooks/useAuth";
// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook";
// LOCAL CUSTOM COMPONENTS
import Label from "../components/label";
import EyeToggleButton from "../components/eye-toggle-button";
// LOCAL CUSTOM HOOK
import usePasswordVisible from "../use-password-visible";

export default function LoginPageView() {
  const { t } = useTranslation();
  
  // LOGIN FORM FIELD VALIDATION SCHEMA
  const validationSchema = yup.object().shape({
    password: yup.string().required(t("Password is required")),
    username: yup.string().matches(/^[0-9]{10}$/, t("National ID must be 10 digits")).required(t("National ID is required"))
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (searchParams.get("session_expired") === "true") {
      setSessionExpired(true);
    }
  }, [searchParams]);

  const initialValues = { username: "", password: "" };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const handleSubmitForm = handleSubmit(async (values) => {
    try {
      setError(null);
      await login(values);
      router.push("/");
    } catch (err: any) {
      const errorMsg = err.validationMessage || err.response?.data?.message || t("Login failed");
      setError(errorMsg);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {sessionExpired && (
        <Alert severity="warning" className="mb-2">
          {t("Your session has expired. Please login again.")}
        </Alert>
      )}
      {error && (
        <Alert severity="error" className="mb-2">
          {error}
        </Alert>
      )}
      <div className="mb-1">
        <Label>{t("National ID")}</Label>
        <TextField
          fullWidth
          name="username"
          size="medium"
          placeholder="1234567890"
          slotProps={{
            htmlInput: { maxLength: 10, inputMode: 'numeric' }
          }}
        />
      </div>

      <div className="mb-2">
        <Label>{t("Password")}</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
          autoComplete="on"
          placeholder="*********"
          type={visiblePassword ? "text" : "password"}
          slotProps={{
            input: {
              endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
            }
          }}
        />
      </div>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={isSubmitting}>
        {t("Login")}
      </Button>
    </FormProvider>
  );
}
