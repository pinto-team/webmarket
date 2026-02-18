"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAuth } from "hooks/useAuth";
import { Checkbox, FormProvider, TextField } from "components/form-hook";
import BirthdayPicker from "components/BirthdayPicker";
import FlexBox from "components/flex-box/flex-box";

import EyeToggleButton from "../components/eye-toggle-button";
import Label from "../components/label";
import usePasswordVisible from "../use-password-visible";

import { t } from "@/i18n/t";
import { toEnglishNumber, toPersianNumber } from "@/utils/persian";

type RegisterStep = "otp" | "register";

export default function RegisterPageView() {
    const router = useRouter();
    const { register, verifyOTP } = useAuth();
    const { visiblePassword, togglePasswordVisible } = usePasswordVisible();

    const [error, setError] = useState<string | null>(null);
    const [mobile, setMobile] = useState("");
    const [step, setStep] = useState<RegisterStep>("register");

    const validationSchema = yup.object({
        birth_day: yup.number().min(1).max(31).required(t("validation.required")),
        birth_month: yup.number().min(1).max(12).required(t("validation.required")),
        birth_year: yup
            .number()
            .min(1300, t("validation.required"))
            .max(1403, t("validation.required"))
            .required(t("validation.required")),
        mobile: yup
            .string()
            .matches(/^09[0-9]{9}$/, t("validation.mobile"))
            .required(t("validation.required")),
        password: yup
            .string()
            .min(6, t("validation.passwordMin"))
            .required(t("validation.required")),
        re_password: yup
            .string()
            .oneOf([yup.ref("password")], t("validation.passwordMatch"))
            .required(t("validation.required")),
        rules: yup
            .bool()
            .test("rules", t("validation.acceptTerms"), (value) => value === true)
            .required(t("validation.acceptTerms")),
        username: yup
            .string()
            .matches(/^[0-9]{10}$/, t("validation.nationalIdLength"))
            .required(t("validation.required")),
    });

    const otpValidationSchema = yup.object({
        code: yup
            .string()
            .length(5, t("validation.codeLength"))
            .required(t("validation.required")),
    });

    const inputProps = {
        endAdornment: (
            <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
        ),
    };

    const methods = useForm({
        defaultValues: {
            birth_day: 1,
            birth_month: 1,
            birth_year: 1380,
            mobile: "",
            password: "",
            re_password: "",
            rules: false,
            username: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const otpMethods = useForm({
        defaultValues: { code: "" },
        resolver: yupResolver(otpValidationSchema),
    });

    const handleSubmitForm = methods.handleSubmit(async (values) => {
        try {
            setError(null);

            const registerData = {
                birth_day: values.birth_day,
                birth_month: values.birth_month,
                birth_year: values.birth_year,
                mobile: toEnglishNumber(String(values.mobile)),
                password: values.password,
                rules: values.rules,
                username: toEnglishNumber(String(values.username)),
            };

            await register(registerData as any);

            setMobile(values.mobile);
            setStep("otp");
        } catch (err: any) {
            const errorMsg =
                err?.validationMessage ||
                err?.response?.data?.message ||
                t("errors.general");

            setError(errorMsg);
        }
    });

    const handleOTPSubmit = otpMethods.handleSubmit(async (values) => {
        try {
            setError(null);

            await verifyOTP({
                code: values.code,
                mobile,
            });

            router.push("/");
        } catch (err: any) {
            const errorMsg =
                err?.validationMessage ||
                err?.response?.data?.message ||
                t("errors.general");

            setError(errorMsg);
        }
    });

    if (step === "otp") {
        return (
            <FormProvider
                key="otp-form"
                methods={otpMethods}
                onSubmit={handleOTPSubmit}
            >
                {error && (
                    <Alert severity="error" className="mb-2">
                        {error}
                    </Alert>
                )}

                <Alert severity="info" className="mb-2">
                    {t("auth.codeSentTo", { mobile })}
                </Alert>

                <div className="mb-2">
                    <Label>{t("auth.verificationCode")}</Label>
                    <TextField
                        autoFocus
                        fullWidth
                        name="code"
                        placeholder={t("validation.codeLength")}
                        size="medium"
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            otpMethods.setValue("code", value);
                        }}
                        slotProps={{
                            htmlInput: { inputMode: "numeric", maxLength: 5 },
                        }}
                    />
                </div>

                <Button
                    fullWidth
                    color="primary"
                    loading={otpMethods.formState.isSubmitting}
                    size="large"
                    type="submit"
                    variant="contained"
                >
                    {t("auth.verifyAndLogin")}
                </Button>
            </FormProvider>
        );
    }

    return (
        <FormProvider
            key="register-form"
            methods={methods}
            onSubmit={handleSubmitForm}
        >
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
                    placeholder={t("auth.nationalIdPlaceholder")}
                    size="medium"
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                        methods.setValue("username", toEnglishNumber(value) as any);
                    }}
                    slotProps={{
                        htmlInput: { inputMode: "numeric", maxLength: 10 },
                    }}
                />
            </div>

            <div className="mb-1">
                <Label>{t("auth.mobile")}</Label>
                <TextField
                    fullWidth
                    name="mobile"
                    placeholder="09123456789"
                    size="medium"
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                        methods.setValue("mobile", toEnglishNumber(value) as any);
                    }}
                    slotProps={{
                        htmlInput: { inputMode: "numeric", maxLength: 11 },
                    }}
                />
            </div>

            <div className="mb-1">
                <Label>{t("profile.birthDate")}</Label>
                <BirthdayPicker />
            </div>

            <div className="mb-1">
                <Label>{t("auth.password")}</Label>
                <TextField
                    fullWidth
                    name="password"
                    placeholder={t("auth.passwordPlaceholder")}
                    size="medium"
                    type={visiblePassword ? "text" : "password"}
                    slotProps={{ input: inputProps }}
                />
            </div>

            <div className="mb-1">
                <Label>{t("profile.confirmPassword")}</Label>
                <TextField
                    fullWidth
                    name="re_password"
                    placeholder={t("auth.passwordPlaceholder")}
                    size="medium"
                    type={visiblePassword ? "text" : "password"}
                    slotProps={{ input: inputProps }}
                />
            </div>

            <div className="agreement">
                <Checkbox
                    color="secondary"
                    name="rules"
                    size="small"
                    label={
                        <FlexBox
                            alignItems="center"
                            flexWrap="wrap"
                            gap={1}
                            justifyContent="flex-start"
                        >
                            <Box>{t("validation.acceptTerms")}</Box>
                        </FlexBox>
                    }
                />
            </div>

            <Button
                fullWidth
                color="primary"
                loading={methods.formState.isSubmitting}
                size="large"
                type="submit"
                variant="contained"
            >
                {t("auth.createAccount")}
            </Button>
        </FormProvider>
    );
}
