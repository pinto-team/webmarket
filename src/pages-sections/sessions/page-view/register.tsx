"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "hooks/useAuth";
// GLOBAL CUSTOM COMPONENTS
import { Checkbox, TextField, FormProvider } from "components/form-hook";
import BirthdayPicker from "components/BirthdayPicker";
// LOCAL CUSTOM COMPONENTS
import EyeToggleButton from "../components/eye-toggle-button";
import Label from "../components/label";
import usePasswordVisible from "../use-password-visible";
import FlexBox from "components/flex-box/flex-box";

export default function RegisterPageView() {
  const { t } = useTranslation();
  
  // REGISTER FORM FIELD VALIDATION SCHEMA
  const validationSchema = yup.object().shape({
    username: yup.string().matches(/^[0-9]{10}$/, t("National ID must be 10 digits")).required(t("National ID is required")),
    mobile: yup.string().matches(/^09[0-9]{9}$/, t("Invalid mobile number")).required(t("Mobile number is required")),
    birth_year: yup.number().min(1300, t("Invalid year")).max(1403, t("Invalid year")).required(t("Birth year is required")),
    birth_month: yup.number().min(1).max(12).required(t("Birth month is required")),
    birth_day: yup.number().min(1).max(31).required(t("Birth day is required")),
    password: yup.string().min(6, t("Password must be at least 6 characters")).required(t("Password is required")),
    re_password: yup
      .string()
      .oneOf([yup.ref("password")], t("Passwords do not match"))
      .required(t("Please repeat password")),
    rules: yup
      .bool()
      .test(
        "rules",
        t("You must accept terms and conditions"),
        (value) => value === true
      )
      .required(t("You must accept terms and conditions"))
  });

  const otpValidationSchema = yup.object().shape({
    code: yup.string().length(5, t("Code must be 5 digits")).required(t("Verification code is required"))
  });
  const router = useRouter();
  const { register, verifyOTP } = useAuth();
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"register" | "otp">("register");
  const [mobile, setMobile] = useState("");

  const inputProps = {
    endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
  };

  const initialValues = {
    username: "",
    mobile: "",
    birth_year: 1380,
    birth_month: 1,
    birth_day: 1,
    password: "",
    re_password: "",
    rules: false
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const otpMethods = useForm({
    defaultValues: { code: "" },
    resolver: yupResolver(otpValidationSchema)
  });

  const handleSubmitForm = methods.handleSubmit(async (values) => {
    try {
      setError(null);
      const { re_password, ...registerData } = values;
      await register(registerData);
      setMobile(values.mobile);
      setStep("otp");
    } catch (err: any) {
      const errorMsg = err.validationMessage || err.response?.data?.message || t("Registration failed");
      setError(errorMsg);
    }
  });

  const handleOTPSubmit = otpMethods.handleSubmit(async (values) => {
    try {
      setError(null);
      await verifyOTP({ mobile, code: values.code });
      router.push("/");
    } catch (err: any) {
      const errorMsg = err.validationMessage || err.response?.data?.message || t("Invalid verification code");
      setError(errorMsg);
    }
  });

  if (step === "otp") {
    return (
      <FormProvider key="otp-form" methods={otpMethods} onSubmit={handleOTPSubmit}>
        {error && (
          <Alert severity="error" className="mb-2">
            {error}
          </Alert>
        )}
        <Alert severity="info" className="mb-2">
          {t("Verification code sent to")} {mobile} {t("sent via SMS")}
        </Alert>
        <div className="mb-2">
          <Label>{t("Verification Code")}</Label>
          <TextField
            fullWidth
            name="code"
            size="medium"
            placeholder={t("Enter 5-digit code")}
            autoFocus
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              otpMethods.setValue('code', value);
            }}
            slotProps={{
              htmlInput: { maxLength: 5, inputMode: 'numeric' }
            }}
          />
        </div>
        <Button
          fullWidth
          size="large"
          type="submit"
          color="primary"
          variant="contained"
          loading={otpMethods.formState.isSubmitting}>
          {t("Verify and Login")}
        </Button>
      </FormProvider>
    );
  }

  return (
    <FormProvider key="register-form" methods={methods} onSubmit={handleSubmitForm}>
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

      <div className="mb-1">
        <Label>{t("Mobile Number")}</Label>
        <TextField
          fullWidth
          name="mobile"
          size="medium"
          placeholder="09123456789"
        />
      </div>

      <div className="mb-1">
        <Label>{t("Birth Date")}</Label>
        <BirthdayPicker />
      </div>

      <div className="mb-1">
        <Label>{t("Password")}</Label>
        <TextField
          fullWidth
          size="medium"
          name="password"
          placeholder="*********"
          type={visiblePassword ? "text" : "password"}
          slotProps={{ input: inputProps }}
        />
      </div>

      <div className="mb-1">
        <Label>{t("Repeat Password")}</Label>
        <TextField
          fullWidth
          size="medium"
          name="re_password"
          placeholder="*********"
          type={visiblePassword ? "text" : "password"}
          slotProps={{ input: inputProps }}
        />
      </div>

      <div className="agreement">
        <Checkbox
          name="rules"
          size="small"
          color="secondary"
          label={
            <FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start" gap={1}>
              <Box>{t("I accept terms and conditions")}</Box>
            </FlexBox>
          }
        />
      </div>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        loading={methods.formState.isSubmitting}>
        {t("Create Account")}
      </Button>
    </FormProvider>
  );
}
