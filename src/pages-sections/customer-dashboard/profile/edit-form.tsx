"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

import { FormProvider, TextField } from "components/form-hook";

import { useProfile } from "@/hooks/useProfile";
import type { UserResource } from "@/types/auth.types";
import { t } from "@/i18n/t";
import { toEnglishNumber } from "@/utils/persian";

const validationSchema = yup.object({
    birth_day: yup
        .number()
        .min(1, t("validation.required"))
        .max(31, t("validation.required"))
        .required(t("validation.required")),
    birth_month: yup
        .number()
        .min(1, t("validation.required"))
        .max(12, t("validation.required"))
        .required(t("validation.required")),
    birth_year: yup
        .number()
        .min(1300, t("validation.required"))
        .max(1404, t("validation.required"))
        .required(t("validation.required")),
    mobile: yup
        .string()
        .matches(/^9[0-9]{9}$/, t("validation.mobile"))
        .required(t("validation.required")),
});

type Props = { user: UserResource };

export default function ProfileEditForm({ user }: Props) {
    const { updateProfile, loading } = useProfile();

    const methods = useForm({
        defaultValues: {
            birth_day: user.birth_day || 1,
            birth_month: user.birth_month || 1,
            birth_year: user.birth_year || 1370,
            mobile: user.mobile || "",
        },
        resolver: yupResolver(validationSchema),
    });

    const handleSubmitForm = methods.handleSubmit(async (values) => {
        try {
            const payload = {
                ...values,
                mobile: toEnglishNumber(String(values.mobile)),
                birth_year: Number(toEnglishNumber(String(values.birth_year))),
                birth_month: Number(toEnglishNumber(String(values.birth_month))),
                birth_day: Number(toEnglishNumber(String(values.birth_day))),
            };

            await updateProfile(payload);
            toast.success(t("profile.updateSuccess"));
        } catch {
            toast.error(t("profile.updateFailed"));
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
            <Grid container spacing={3}>
                <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                        fullWidth
                        name="mobile"
                        size="medium"
                        label={t("profile.mobile")}
                        placeholder={t("profile.mobile")}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9۰-۹]/g, "");
                            methods.setValue("mobile", toEnglishNumber(value) as any);
                        }}
                        slotProps={{
                            htmlInput: { inputMode: "numeric", maxLength: 10 },
                        }}
                    />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                        fullWidth
                        name="birth_year"
                        size="medium"
                        type="number"
                        label={t("profile.birthYear")}
                        placeholder={t("profile.birthYear")}
                    />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                        fullWidth
                        name="birth_month"
                        size="medium"
                        type="number"
                        label={t("profile.birthMonth")}
                        select
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <MenuItem key={m} value={m}>
                                {m}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                    <TextField
                        fullWidth
                        name="birth_day"
                        size="medium"
                        type="number"
                        label={t("profile.birthDay")}
                        select
                    >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>
                        ))}
                    </TextField>
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
