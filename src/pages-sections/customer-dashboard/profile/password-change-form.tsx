"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { FormProvider, TextField } from "components/form-hook";
import { useProfile } from "@/hooks/useProfile";
import { t } from "@/i18n/t";

const validationSchema = yup.object({
    new_password: yup
        .string()
        .min(6, t("validation.passwordMin"))
        .required(t("validation.required")),
    new_password_confirmation: yup
        .string()
        .oneOf([yup.ref("new_password")], t("validation.passwordMatch"))
        .required(t("validation.required")),
    password: yup.string().required(t("validation.required")),
});

export default function PasswordChangeForm() {
    const { updatePassword, loading } = useProfile();

    const methods = useForm({
        defaultValues: {
            new_password: "",
            new_password_confirmation: "",
            password: "",
        },
        resolver: yupResolver(validationSchema),
    });

    const handleSubmitForm = methods.handleSubmit(async (values) => {
        try {
            await updatePassword(values);
            toast.success(t("profile.passwordUpdateSuccess"));
            methods.reset();
        } catch {
            toast.error(t("profile.passwordUpdateFailed"));
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
            <Grid container spacing={3}>
                <Grid size={12}>
                    <TextField
                        fullWidth
                        name="password"
                        size="medium"
                        type="password"
                        label={t("profile.currentPassword")}
                    />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                        fullWidth
                        name="new_password"
                        size="medium"
                        type="password"
                        label={t("profile.newPassword")}
                    />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                        fullWidth
                        name="new_password_confirmation"
                        size="medium"
                        type="password"
                        label={t("profile.confirmPassword")}
                    />
                </Grid>

                <Grid size={12}>
                    <Button
                        disableElevation
                        disabled={loading}
                        size="large"
                        type="submit"
                        color="primary"
                        variant="contained"
                    >
                        {t("profile.saveChanges")}
                    </Button>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
