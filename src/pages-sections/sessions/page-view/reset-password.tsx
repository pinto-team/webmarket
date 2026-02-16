"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook";
import FlexRowCenter from "components/flex-box/flex-row-center";
// LOCAL CUSTOM COMPONENT
import BoxLink from "../components/box-link";
import EyeToggleButton from "../components/eye-toggle-button";
import usePasswordVisible from "../use-password-visible";
// SERVICE
import { authService } from "@/services/auth.service";

// STEP 1: REQUEST OTP
const requestSchema = yup.object().shape({
  username: yup.string().required("نام کاربری الزامی است"),
  mobile: yup.string().matches(/^09[0-9]{9}$/, "شماره موبایل نامعتبر است").required("شماره موبایل الزامی است")
});

// STEP 2: RESET PASSWORD WITH OTP
const resetSchema = yup.object().shape({
  confirmCode: yup.string().matches(/^[0-9]{5}$/, "کد باید ۵ رقم باشد").required("کد تایید الزامی است"),
  password: yup.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد").required("رمز عبور الزامی است"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "رمزهای عبور مطابقت ندارند")
    .required("لطفا رمز عبور را تکرار کنید")
});

export default function ResetPassword() {
  const router = useRouter();
  const { visiblePassword, togglePasswordVisible } = usePasswordVisible();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<"request" | "reset">("request");
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");

  const requestMethods = useForm({
    defaultValues: { username: "", mobile: "" },
    resolver: yupResolver(requestSchema)
  });

  const resetMethods = useForm({
    defaultValues: { confirmCode: "", password: "", password_confirmation: "" },
    resolver: yupResolver(resetSchema)
  });

  const handleRequestOTP = requestMethods.handleSubmit(async (values) => {
    try {
      setError(null);
      await authService.passwordLost(values);
      setUsername(values.username);
      setMobile(values.mobile);
      setSuccess("کد تایید به شماره موبایل شما ارسال شد");
      setStep("reset");
    } catch (err: any) {
      const errorMsg = err.validationMessage || err.response?.data?.message || "درخواست ناموفق بود";
      setError(errorMsg);
    }
  });

  const handleResetPassword = resetMethods.handleSubmit(async (values) => {
    try {
      setError(null);
      await authService.passwordReset({
        username,
        password: values.password,
        code: values.confirmCode
      });
      setSuccess("رمز عبور با موفقیت تغییر کرد");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const errorMsg = err.validationMessage || err.response?.data?.message || "تغییر رمز عبور ناموفق بود";
      setError(errorMsg);
    }
  });

  const inputProps = {
    endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
  };

  return (
    <Fragment>
      <Typography variant="h3" fontWeight={700} sx={{ mb: 4, textAlign: "center" }}>
        بازیابی رمز عبور
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {step === "request" ? (
        <FormProvider key="request-form" methods={requestMethods} onSubmit={handleRequestOTP}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              name="username"
              label="نام کاربری"
              size="medium"
              placeholder="نام کاربری یا ایمیل"
            />

            <TextField
              fullWidth
              name="mobile"
              label="شماره موبایل"
              size="medium"
              placeholder="09123456789"
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              color="primary"
              variant="contained"
              loading={requestMethods.formState.isSubmitting}>
              ارسال کد تایید
            </Button>
          </Stack>
        </FormProvider>
      ) : (
        <FormProvider key="reset-form" methods={resetMethods} onSubmit={handleResetPassword}>
          <Stack spacing={3}>
            <Alert severity="info">
              کد تایید برای شماره موبایل {mobile} پیامک شد
            </Alert>

            <TextField
              fullWidth
              name="confirmCode"
              label="کد تایید"
              size="medium"
              placeholder="12345"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                resetMethods.setValue('confirmCode', value);
              }}
              slotProps={{
                htmlInput: { maxLength: 5, inputMode: 'numeric' }
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="رمز عبور جدید"
              size="medium"
              placeholder="*********"
              type={visiblePassword ? "text" : "password"}
              slotProps={{ input: inputProps }}
            />

            <TextField
              fullWidth
              name="password_confirmation"
              label="تکرار رمز عبور"
              size="medium"
              placeholder="*********"
              type={visiblePassword ? "text" : "password"}
              slotProps={{ input: inputProps }}
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              color="primary"
              variant="contained"
              loading={resetMethods.formState.isSubmitting}>
              تغییر رمز عبور
            </Button>
          </Stack>
        </FormProvider>
      )}

      <FlexRowCenter mt={3} justifyContent="center" gap={1}>
        <Typography variant="body1" color="text.secondary">
          حساب کاربری ندارید؟
        </Typography>

        <BoxLink title="ثبت نام" href="/register" />
      </FlexRowCenter>
    </Fragment>
  );
}
