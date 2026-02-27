"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

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
import { toEnglishNumber, toPersianNumber } from "@/utils/persian";
import { useLoginContinuation } from "@/hooks/useLoginContinuation";

type LoginFormValues = {
    username: string; // ذخیره: انگلیسی
    password: string;
};

export default function LoginPageView() {
    const router = useRouter();
    const { login } = useAuth();
    const { visiblePassword, togglePasswordVisible } = usePasswordVisible();
    const { postLoginNavigation, sessionExpired } = useLoginContinuation();

    const [error, setError] = useState<string | null>(null);

    const validationSchema = useMemo(
        () =>
            yup.object({
                username: yup
                    .string()
                    .matches(/^[0-9]{10}$/, t("validation.nationalIdLength"))
                    .required(t("validation.required")),
                password: yup.string().required(t("validation.required")),
            }),
        []
    );

    const methods = useForm<LoginFormValues>({
        defaultValues: { username: "", password: "" },
        resolver: yupResolver(validationSchema),
        mode: "onSubmit",
    });

    const usernameStoredEnglish = methods.watch("username"); // همیشه انگلیسی ذخیره شده

    const handleSubmitForm = methods.handleSubmit(async (values) => {
        try {
            setError(null);

            const payload = {
                ...values,
                // اینجا هم مطمئن می‌شیم انگلیسیه
                username: toEnglishNumber(values.username),
            };

            await login(payload as any);

            if (postLoginNavigation.type === "back") {
                router.back();
                return;
            }

            router.replace(postLoginNavigation.href);
        } catch (err: any) {
            const errorMsg =
                err?.validationMessage || err?.response?.data?.message || t("errors.general");
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
                    // ✅ نمایش فارسی (ولی ذخیره انگلیسی)
                    value={toPersianNumber(usernameStoredEnglish)}
                    onChange={(e) => {
                        // هم انگلیسی هم فارسی را اجازه می‌دهیم
                        const cleaned = e.target.value.replace(/[^\d۰-۹]/g, "");
                        const english = toEnglishNumber(cleaned);

                        methods.setValue("username", english, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                        });
                    }}
                    slotProps={{
                        htmlInput: {
                            maxLength: 10,
                            inputMode: "numeric",
                            dir: "rtl",
                            style: {
                                textAlign: "right",
                                direction: "rtl",
                                unicodeBidi: "plaintext",
                            },
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
                        htmlInput: {
                            dir: "rtl",
                            style: { textAlign: "right", unicodeBidi: "plaintext" },
                        },
                        input: {
                            endAdornment: (
                                <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
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
                loading={methods.formState.isSubmitting as any}
            >
                {t("auth.login")}
            </Button>
        </FormProvider>
    );
}