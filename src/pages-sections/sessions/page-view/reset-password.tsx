"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { TextField, FormProvider } from "components/form-hook";
import FlexRowCenter from "components/flex-box/flex-row-center";

import BoxLink from "../components/box-link";
import EyeToggleButton from "../components/eye-toggle-button";
import usePasswordVisible from "../use-password-visible";

import { authService } from "@/services/auth.service";
import { t } from "@/i18n/t";
import { toEnglishNumber, toPersianNumber } from "@/utils/persian";

type Step = "request" | "reset";

export default function ResetPasswordPageView() {
    const router = useRouter();
    const { visiblePassword, togglePasswordVisible } = usePasswordVisible();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [step, setStep] = useState<Step>("request");

    const [username, setUsername] = useState("");
    const [mobile, setMobile] = useState("");

    // STEP 1: REQUEST OTP
    const requestSchema = yup.object().shape({
        username: yup.string().required(t("validation.required")),
        mobile: yup
            .string()
            .matches(/^09[0-9]{9}$/, t("validation.mobile"))
            .required(t("validation.required")),
    });

    // STEP 2: RESET PASSWORD WITH OTP
    const resetSchema = yup.object().shape({
        confirmCode: yup
            .string()
            .matches(/^[0-9]{5}$/, t("validation.codeLength"))
            .required(t("validation.required")),
        password: yup
            .string()
            .min(6, t("validation.passwordMin"))
            .required(t("validation.required")),
        password_confirmation: yup
            .string()
            .oneOf([yup.ref("password")], t("validation.passwordMatch"))
            .required(t("validation.required")),
    });

    const requestMethods = useForm({
        defaultValues: { username: "", mobile: "" },
        resolver: yupResolver(requestSchema),
    });

    const resetMethods = useForm({
        defaultValues: { confirmCode: "", password: "", password_confirmation: "" },
        resolver: yupResolver(resetSchema),
    });

    const handleRequestOTP = requestMethods.handleSubmit(async (values) => {
        try {
            setError(null);
            setSuccess(null);

            const payload = {
                username: toEnglishNumber(String(values.username)),
                mobile: toEnglishNumber(String(values.mobile)),
            };

            await authService.passwordLost(payload as any);

            setUsername(payload.username);
            setMobile(payload.mobile);

            setSuccess(t("messages.otpSent", t("messages.success", t("common.success"))));
            setStep("reset");
        } catch (err: any) {
            const errorMsg =
                err?.validationMessage ||
                err?.response?.data?.message ||
                t("errors.general");
            setError(errorMsg);
        }
    });

    const handleResetPassword = resetMethods.handleSubmit(async (values) => {
        try {
            setError(null);
            setSuccess(null);

            await authService.passwordReset({
                username,
                password: values.password,
                code: toEnglishNumber(String(values.confirmCode)),
            } as any);

            setSuccess(t("messages.passwordResetSuccess", t("common.success")));
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            const errorMsg =
                err?.validationMessage ||
                err?.response?.data?.message ||
                t("errors.general");
            setError(errorMsg);
        }
    });

    const inputProps = {
        endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />,
    };

    return (
        <Fragment>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 4, textAlign: "center" }}>
                {t("auth.resetPassword")}
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
                            label={t("auth.nationalId", t("auth.email"))}
                            size="medium"
                            placeholder={t("auth.usernameOrEmail", t("auth.email"))}
                            onChange={(e) => {
                                requestMethods.setValue("username", toEnglishNumber(e.target.value) as any);
                            }}
                        />

                        <TextField
                            fullWidth
                            name="mobile"
                            label={t("auth.mobile")}
                            size="medium"
                            placeholder="09123456789"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                                requestMethods.setValue("mobile", toEnglishNumber(value) as any);
                            }}
                            slotProps={{
                                htmlInput: { maxLength: 11, inputMode: "numeric" },
                            }}
                        />

                        <Button
                            fullWidth
                            size="large"
                            type="submit"
                            color="primary"
                            variant="contained"
                            loading={requestMethods.formState.isSubmitting}
                        >
                            {t("auth.sendVerificationCode", t("auth.verificationCode"))}
                        </Button>
                    </Stack>
                </FormProvider>
            ) : (
                <FormProvider key="reset-form" methods={resetMethods} onSubmit={handleResetPassword}>
                    <Stack spacing={3}>
                        <Alert severity="info">
                            {t("messages.otpSentToMobile")} {toPersianNumber(mobile)}
                        </Alert>

                        <TextField
                            fullWidth
                            name="confirmCode"
                            label={t("auth.verificationCode")}
                            size="medium"
                            placeholder="12345"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                                resetMethods.setValue("confirmCode", toEnglishNumber(value) as any);
                            }}
                            slotProps={{
                                htmlInput: { maxLength: 5, inputMode: "numeric" },
                            }}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            label={t("auth.newPassword", t("profile.changePassword"))}
                            size="medium"
                            placeholder="*********"
                            type={visiblePassword ? "text" : "password"}
                            slotProps={{ input: inputProps }}
                        />

                        <TextField
                            fullWidth
                            name="password_confirmation"
                            label={t("profile.confirmPassword")}
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
                            loading={resetMethods.formState.isSubmitting}
                        >
                            {t("auth.resetPassword")}
                        </Button>
                    </Stack>
                </FormProvider>
            )}

            <FlexRowCenter mt={3} justifyContent="center" gap={1}>
                <Typography variant="body1" color="text.secondary">
                    {t("auth.dontHaveAccount")}
                </Typography>

                <BoxLink title={t("auth.register")} href="/register" />
            </FlexRowCenter>
        </Fragment>
    );
}
