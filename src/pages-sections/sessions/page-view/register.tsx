"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useAuth } from "hooks/useAuth";
import { Checkbox, TextField, FormProvider } from "components/form-hook";
import BirthdayPicker from "components/BirthdayPicker";
import FlexBox from "components/flex-box/flex-box";

import EyeToggleButton from "../components/eye-toggle-button";
import Label from "../components/label";
import usePasswordVisible from "../use-password-visible";

import { t } from "@/i18n/t";
import { toPersianNumber, toEnglishNumber } from "@/utils/persian";

type RegisterStep = "register" | "otp";

export default function RegisterPageView() {
    const router = useRouter();
    const { register, verifyOTP } = useAuth();
    const { visiblePassword, togglePasswordVisible } = usePasswordVisible();

    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<RegisterStep>("register");
    const [mobile, setMobile] = useState("");

    const validationSchema = yup.object().shape({
        username: yup
            .string()
            .matches(/^[0-9]{10}$/, t("validation.nationalIdLength"))
            .required(t("validation.required")),
        mobile: yup
            .string()
            .matches(/^09[0-9]{9}$/, t("validation.mobile"))
            .required(t("validation.required")),
        birth_year: yup
            .number()
            .min(1300, t("validation.required"))
            .max(1403, t("validation.required"))
            .required(t("validation.required")),
        birth_month: yup.number().min(1).max(12).required(t("validation.required")),
        birth_day: yup.number().min(1).max(31).required(t("validation.required")),
        password: yup.string().min(6, t("validation.passwordMin")).required(t("validation.required")),
        re_password: yup
            .string()
            .oneOf([yup.ref("password")], t("validation.passwordMatch"))
            .required(t("validation.required")),
        rules: yup
            .bool()
            .test("rules", t("validation.acceptTerms"), (value) => value === true)
            .required(t("validation.acceptTerms")),
    });

    const otpValidationSchema = yup.object().shape({
        code: yup.string().length(5, t("validation.codeLength")).required(t("validation.required")),
    });

    const inputProps = {
        endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />,
    };

    const methods = useForm({
        defaultValues: {
            username: "",
            mobile: "",
            birth_year: 1380,
            birth_month: 1,
            birth_day: 1,
            password: "",
            re_password: "",
            rules: false,
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

            // ensure numeric fields are correct even if user typed Persian digits elsewhere
            const registerData = {
                username: toEnglishNumber(String(values.username)),
                mobile: toEnglishNumber(String(values.mobile)),
                birth_year: values.birth_year,
                birth_month: values.birth_month,
                birth_day: values.birth_day,
                password: values.password,
                rules: values.rules,
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
            await verifyOTP({ mobile, code: values.code });
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
            <FormProvider key="otp-form" methods={otpMethods} onSubmit={handleOTPSubmit}>
                {error && (
                    <Alert severity="error" className="mb-2">
                        {error}
                    </Alert>
                )}

                <Alert severity="info" className="mb-2">
                    {t("auth.verificationCode")}: {toPersianNumber(mobile)}
                </Alert>

                <div className="mb-2">
                    <Label>{t("auth.verificationCode")}</Label>
                    <TextField
                        fullWidth
                        name="code"
                        size="medium"
                        placeholder={t("validation.codeLength")}
                        autoFocus
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            otpMethods.setValue("code", value);
                        }}
                        slotProps={{
                            htmlInput: { maxLength: 5, inputMode: "numeric" },
                        }}
                    />
                </div>

                <Button fullWidth size="large" type="submit" color="primary" variant="contained" loading={otpMethods.formState.isSubmitting}>
                    {t("auth.verifyAndLogin")}
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
                <Label>{t("auth.nationalId")}</Label>
                <TextField
                    fullWidth
                    name="username"
                    size="medium"
                    placeholder="1234567890"
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                        methods.setValue("username", toEnglishNumber(value) as any);
                    }}
                    slotProps={{
                        htmlInput: { maxLength: 10, inputMode: "numeric" },
                    }}
                />
            </div>

            <div className="mb-1">
                <Label>{t("auth.mobile")}</Label>
                <TextField
                    fullWidth
                    name="mobile"
                    size="medium"
                    placeholder="09123456789"
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                        methods.setValue("mobile", toEnglishNumber(value) as any);
                    }}
                    slotProps={{
                        htmlInput: { maxLength: 11, inputMode: "numeric" },
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
                    size="medium"
                    name="password"
                    placeholder="*********"
                    type={visiblePassword ? "text" : "password"}
                    slotProps={{ input: inputProps }}
                />
            </div>

            <div className="mb-1">
                <Label>{t("profile.confirmPassword")}</Label>
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
                            <Box>{t("validation.acceptTerms")}</Box>
                        </FlexBox>
                    }
                />
            </div>

            <Button fullWidth size="large" type="submit" color="primary" variant="contained" loading={methods.formState.isSubmitting}>
                {t("auth.createAccount")}
            </Button>
        </FormProvider>
    );
}
