"use client";

import { Fragment, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { FormProvider, TextField } from "components/form-hook";
import FlexRowCenter from "components/flex-box/flex-row-center";

import BoxLink from "../components/box-link";
import EyeToggleButton from "../components/eye-toggle-button";
import usePasswordVisible from "../use-password-visible";
import Label from "../components/label";

import { authService } from "@/services/auth.service";
import { t } from "@/i18n/t";
import { toEnglishNumber, toPersianNumber } from "@/utils/persian";
import LogoWithTitle from "@/pages-sections/sessions/components/logo-title";

type Step = "request" | "reset";

type RequestFormValues = {
    mobile: string;   // ذخیره: انگلیسی
    username: string; // ذخیره: انگلیسی
};

type ResetFormValues = {
    confirmCode: string; // ذخیره: انگلیسی
    password: string;
    password_confirmation: string;
};

function onlyDigits(v: string) {
    return v.replace(/[^\d۰-۹]/g, "");
}

const rtlNumericInputSx = {
    dir: "rtl" as const,
    style: {
        textAlign: "right" as const,
        direction: "rtl" as const,
        unicodeBidi: "plaintext" as const,
    },
};

export default function ResetPasswordPageView() {
    const router = useRouter();
    const { visiblePassword, togglePasswordVisible } = usePasswordVisible();

    const [error, setError] = useState<string | null>(null);
    const [mobile, setMobile] = useState("");   // اینجا هم انگلیسی ذخیره می‌کنی
    const [step, setStep] = useState<Step>("request");
    const [success, setSuccess] = useState<string | null>(null);
    const [username, setUsername] = useState(""); // برای reset API (انگلیسی)

    const [redirectTimer, setRedirectTimer] = useState<number | null>(null);
    useEffect(() => {
        return () => {
            if (redirectTimer) window.clearTimeout(redirectTimer);
        };
    }, [redirectTimer]);

    const requestSchema = useMemo(
        () =>
            yup.object({
                mobile: yup
                    .string()
                    .matches(/^09[0-9]{9}$/, t("validation.mobile"))
                    .required(t("validation.required")),
                username: yup.string().required(t("validation.required")),
            }),
        []
    );

    const resetSchema = useMemo(
        () =>
            yup.object({
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
            }),
        []
    );

    const requestMethods = useForm<RequestFormValues>({
        defaultValues: { mobile: "", username: "" },
        resolver: yupResolver(requestSchema),
    });

    const resetMethods = useForm<ResetFormValues>({
        defaultValues: { confirmCode: "", password: "", password_confirmation: "" },
        resolver: yupResolver(resetSchema),
    });

    // ✅ watch برای نمایش فارسی
    const requestUsernameEn = requestMethods.watch("username");
    const requestMobileEn = requestMethods.watch("mobile");
    const resetCodeEn = resetMethods.watch("confirmCode");

    const passwordSlotProps = {
        input: {
            endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />,
        },
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
            const errorMsg = err?.validationMessage || err?.response?.data?.message || t("errors.general");
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

            const tId = window.setTimeout(() => router.replace("/login"), 2000);
            setRedirectTimer(tId);
        } catch (err: any) {
            const errorMsg = err?.validationMessage || err?.response?.data?.message || t("errors.general");
            setError(errorMsg);
        }
    });

    return (
        <Fragment>
            <LogoWithTitle hideTitle />

            <Typography variant="h3" fontWeight={700} sx={{ mb: 4, textAlign: "center" }}>
                {t("auth.resetPassword")}
            </Typography>

            {error && (
                <Alert severity="error" className="mb-2">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" className="mb-2">
                    {success}
                </Alert>
            )}

            {step === "request" ? (
                <FormProvider key="request-form" methods={requestMethods} onSubmit={handleRequestOTP}>
                    <div className="mb-1">
                        <Label>{t("auth.nationalId")}</Label>
                        <TextField
                            fullWidth
                            name="username"
                            size="medium"
                            placeholder={t("auth.nationalIdPlaceholder")}
                            // ✅ نمایش فارسی
                            value={toPersianNumber(requestUsernameEn)}
                            onChange={(e) => {
                                const cleaned = onlyDigits(e.target.value);
                                const english = toEnglishNumber(cleaned);

                                requestMethods.setValue("username", english as any, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                });
                            }}
                            slotProps={{
                                htmlInput: {
                                    ...rtlNumericInputSx,
                                    maxLength: 10,
                                    inputMode: "numeric",
                                },
                            }}
                        />
                    </div>

                    <div className="mb-2">
                        <Label>{t("auth.mobile")}</Label>
                        <TextField
                            fullWidth
                            name="mobile"
                            size="medium"
                            placeholder={t("auth.mobilePlaceholder")}
                            // ✅ نمایش فارسی
                            value={toPersianNumber(requestMobileEn)}
                            onChange={(e) => {
                                const cleaned = onlyDigits(e.target.value);
                                const english = toEnglishNumber(cleaned);

                                requestMethods.setValue("mobile", english as any, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                });
                            }}
                            slotProps={{
                                htmlInput: {
                                    ...rtlNumericInputSx,
                                    inputMode: "numeric",
                                    maxLength: 11,
                                },
                            }}
                        />
                    </div>

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        color="primary"
                        variant="contained"
                        loading={requestMethods.formState.isSubmitting as any}
                    >
                        {t("auth.sendVerificationCode")}
                    </Button>
                </FormProvider>
            ) : (
                <FormProvider key="reset-form" methods={resetMethods} onSubmit={handleResetPassword}>
                    <Alert severity="info" className="mb-2">
                        {t("messages.otpSentToMobile")} {toPersianNumber(mobile)}
                    </Alert>

                    <div className="mb-1">
                        <Label>{t("auth.verificationCode")}</Label>
                        <TextField
                            fullWidth
                            name="confirmCode"
                            size="medium"
                            placeholder={t("auth.verificationCodePlaceholder")}
                            // ✅ نمایش فارسی
                            value={toPersianNumber(resetCodeEn)}
                            onChange={(e) => {
                                const cleaned = onlyDigits(e.target.value);
                                const english = toEnglishNumber(cleaned);

                                resetMethods.setValue("confirmCode", english as any, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                });
                            }}
                            slotProps={{
                                htmlInput: {
                                    ...rtlNumericInputSx,
                                    inputMode: "numeric",
                                    maxLength: 5,
                                },
                            }}
                        />
                    </div>

                    <div className="mb-1">
                        <Label>{t("auth.newPassword")}</Label>
                        <TextField
                            fullWidth
                            size="medium"
                            name="password"
                            autoComplete="new-password"
                            placeholder={t("auth.passwordPlaceholder")}
                            type={visiblePassword ? "text" : "password"}
                            slotProps={passwordSlotProps}
                        />
                    </div>

                    <div className="mb-2">
                        <Label>{t("profile.confirmPassword")}</Label>
                        <TextField
                            fullWidth
                            size="medium"
                            name="password_confirmation"
                            autoComplete="new-password"
                            placeholder={t("auth.passwordPlaceholder")}
                            type={visiblePassword ? "text" : "password"}
                            slotProps={passwordSlotProps}
                        />
                    </div>

                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        color="primary"
                        variant="contained"
                        loading={resetMethods.formState.isSubmitting as any}
                    >
                        {t("auth.resetPassword")}
                    </Button>
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