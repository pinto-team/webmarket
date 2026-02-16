"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { FormProvider, TextField } from "components/form-hook";
import { useProfile } from "@/hooks/useProfile";
import type { UserResource } from "@/types/auth.types";

const validationSchema = yup.object().shape({
  email: yup.string().email("ایمیل نامعتبر است").max(155, "ایمیل نباید بیشتر از ۱۵۵ کاراکتر باشد").required("ایمیل الزامی است")
});

type Props = { user: UserResource };

export default function ProfileOptionsForm({ user }: Props) {
  const { updateOptions, loading } = useProfile();

  const methods = useForm({
    defaultValues: {
      email: user.email || ""
    },
    resolver: yupResolver(validationSchema)
  });

  const { handleSubmit } = methods;

  const handleSubmitForm = handleSubmit(async (values) => {
    try {
      await updateOptions(values);
      toast.success("ایمیل با موفقیت بروزرسانی شد");
    } catch {
      toast.error("خطا در بروزرسانی ایمیل");
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Grid container spacing={3}>
        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="email" type="email" label="ایمیل" />
        </Grid>

        <Grid size={12}>
          <Button disableElevation size="large" type="submit" color="primary" variant="contained" disabled={loading}>
            ذخیره تغییرات
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
