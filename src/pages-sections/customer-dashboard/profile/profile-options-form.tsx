"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import { FormProvider, TextField } from "components/form-hook";
import { useProfile } from "@/hooks/useProfile";
import type { UserResource } from "@/types/auth.types";
import { t } from "@/i18n/t";

const validationSchema = yup.object({
    email: yup
        .string()
        .email(t("validation.email"))
        .max(155, t("validation.invalidInput"))
        .required(t("validation.required")),
});

type Props = { user: UserResource };

export default function ProfileOptionsForm({ user }: Props) {
    const { updateOptions, loading } = useProfile();

    const methods = useForm({
        defaultValues: {
            email: user.email || "",
        },
        resolver: yupResolver(validationSchema),
    });

    const handleSubmitForm = methods.handleSubmit(async (values) => {
        try {
            await updateOptions(values);
            toast.success(t("profile.updateSuccess"));
        } catch {
            toast.error(t("profile.optionsUpdateFailed"));
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
            <Grid container spacing={3}>
                <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                        fullWidth
                        name="email"
                        size="medium"
                        type="email"
                        label={t("profile.email")}
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
