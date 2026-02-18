"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAuth } from "hooks/useAuth";
import { TextField, FormProvider } from "components/form-hook";

import Label from "../components/label";
import EyeToggleButton from "../components/eye-toggle-button";
import usePasswordVisible from "../use-password-visible";

import { t } from "@/i18n/t";
import { toEnglishNumber } from "@/utils/persian";

export default function LoginPageView() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const { visiblePassword, togglePasswordVisible } = usePasswordVisible();

    const [error, setError] = useState<string | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        setSessionExpired(searchParams.get("session_expired") === "true");
    }, [searchParams]);

    const validationSchema = yup.object({
        username: yup
            .string()
            .matches(/^[0-9]{10}$/, t("validation.nationalIdLength"))
            .required(t("validation.required")),
        password: yup
            .string()
            .required(t("validation.required")),
    });

    const methods = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const handleSubmitForm = methods.handleSubmit(async (values) => {
        try {
            setError(null);

            const payload = {
                ...values,
                username: toEnglishNumber(values.username),
            };

            await login(payload as any);
            router.push("/");
        } catch (err: any) {
            const errorMsg =
                err?.validationMessage ||
                err?.response?.data?.message ||
                t("errors.general");

            setError(errorMsg);
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
            {sessionExpired && (
                <Alert severity="warning" className="mb-2">
                    {t("auth.sessionExpired")}
                </Alert>
            )}

            {error && (
                <Alert severity="error" className="mb-2">
                    {error}
                </Alert>
            )}

            <div className="mb-1">
                <Label>{t("auth.nationalId")}</Label>
                <TextField
                    fullWidth
                    name="username"
                    size="medium"
                    placeholder={t("auth.nationalIdPlaceholder")}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                        methods.setValue("username", toEnglishNumber(value) as any);
                    }}
                    slotProps={{
                        htmlInput: {
                            maxLength: 10,
                            inputMode: "numeric",
                        },
                    }}
                />
            </div>

            <div className="mb-2">
                <Label>{t("auth.password")}</Label>
                <TextField
                    fullWidth
                    size="medium"
                    name="password"
                    autoComplete="current-password"
                    placeholder={t("auth.passwordPlaceholder")}
                    type={visiblePassword ? "text" : "password"}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <EyeToggleButton
                                    show={visiblePassword}
                                    click={togglePasswordVisible}
                                />
                            ),
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
                loading={methods.formState.isSubmitting}
            >
                {t("auth.login")}
            </Button>
        </FormProvider>
    );
}
