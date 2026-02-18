"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { FormProvider, TextField } from "components/form-hook";
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
    const [mobile, setMobile] = useState("");
    const [step, setStep] = useState<Step>("request");
    const [success, setSuccess] = useState<string | null>(null);
    const [username, setUsername] = useState("");

    const requestSchema = yup.object({
        mobile: yup
            .string()
            .matches(/^09[0-9]{9}$/, t("validation.mobile"))
            .required(t("validation.required")),
        username: yup.string().required(t("validation.required")),
    });

    const resetSchema = yup.object({
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
        defaultValues: { mobile: "", username: "" },
        resolver: yupResolver(requestSchema),
    });

    const resetMethods = useForm({
        defaultValues: {
            confirmCode: "",
            password: "",
            password_confirmation: "",
        },
        resolver: yupResolver(resetSchema),
    });

    const inputProps = {
        endAdornment: (
            <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
        ),
    };

    const handleRequestOTP = requestMethods.handleSubmit(async (values) => {
        try {
            setError(null);
            setSuccess(null);

            const payload = {
                mobile: toEnglishNumber(String(values.mobile)),
                username: toEnglishNumber(String(values.username)),
            };

            await authService.passwordLost(payload as any);

            setMobile(payload.mobile);
            setUsername(payload.username);
            setSuccess(t("messages.otpSent"));
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
                code: toEnglishNumber(String(values.confirmCode)),
                password: values.password,
                username,
            } as any);

            setSuccess(t("messages.passwordResetSuccess"));
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            const errorMsg =
                err?.validationMessage ||
                err?.response?.data?.message ||
                t("errors.general");

            setError(errorMsg);
        }
    });

    return (
        <Fragment>
            <Typography
                variant="h3"
                fontWeight={700}
                sx={{ mb: 4, textAlign: "center" }}
            >
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
                <FormProvider
                    key="request-form"
                    methods={requestMethods}
                    onSubmit={handleRequestOTP}
                >
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            name="username"
                            label={t("auth.usernameOrEmail")}
                            placeholder={t("auth.usernameOrEmail")}
                            size="medium"
                            onChange={(e) =>
                                requestMethods.setValue(
                                    "username",
                                    toEnglishNumber(e.target.value) as any
                                )
                            }
                        />

                        <TextField
                            fullWidth
                            name="mobile"
                            label={t("auth.mobile")}
                            placeholder={t("auth.mobile")}
                            size="medium"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                                requestMethods.setValue(
                                    "mobile",
                                    toEnglishNumber(value) as any
                                );
                            }}
                            slotProps={{
                                htmlInput: { inputMode: "numeric", maxLength: 11 },
                            }}
                        />

                        <Button
                            fullWidth
                            color="primary"
                            loading={requestMethods.formState.isSubmitting}
                            size="large"
                            type="submit"
                            variant="contained"
                        >
                            {t("auth.sendVerificationCode")}
                        </Button>
                    </Stack>
                </FormProvider>
            ) : (
                <FormProvider
                    key="reset-form"
                    methods={resetMethods}
                    onSubmit={handleResetPassword}
                >
                    <Stack spacing={3}>
                        <Alert severity="info">
                            {t("messages.otpSentToMobile")} {toPersianNumber(mobile)}
                        </Alert>

                        <TextField
                            fullWidth
                            name="confirmCode"
                            label={t("auth.verificationCode")}
                            placeholder={t("auth.verificationCode")}
                            size="medium"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                                resetMethods.setValue(
                                    "confirmCode",
                                    toEnglishNumber(value) as any
                                );
                            }}
                            slotProps={{
                                htmlInput: { inputMode: "numeric", maxLength: 5 },
                            }}
                        />

                        <TextField
                            fullWidth
                            name="password"
                            label={t("auth.newPassword")}
                            placeholder={t("auth.passwordPlaceholder")}
                            size="medium"
                            type={visiblePassword ? "text" : "password"}
                            slotProps={{ input: inputProps }}
                        />

                        <TextField
                            fullWidth
                            name="password_confirmation"
                            label={t("profile.confirmPassword")}
                            placeholder={t("auth.passwordPlaceholder")}
                            size="medium"
                            type={visiblePassword ? "text" : "password"}
                            slotProps={{ input: inputProps }}
                        />

                        <Button
                            fullWidth
                            color="primary"
                            loading={resetMethods.formState.isSubmitting}
                            size="large"
                            type="submit"
                            variant="contained"
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
