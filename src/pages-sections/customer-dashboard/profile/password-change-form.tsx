"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { FormProvider, TextField } from "components/form-hook";
import { useProfile } from "@/hooks/useProfile";

const validationSchema = yup.object().shape({
  password: yup.string().required("رمز عبور فعلی الزامی است"),
  new_password: yup.string().min(5, "رمز عبور باید حداقل ۵ کاراکتر باشد").required("رمز عبور جدید الزامی است"),
  new_password_confirmation: yup.string().oneOf([yup.ref("new_password")], "رمزهای عبور مطابقت ندارند").required("تایید رمز عبور الزامی است")
});

export default function PasswordChangeForm() {
  const { updatePassword, loading } = useProfile();

  const methods = useForm({
    defaultValues: {
      password: "",
      new_password: "",
      new_password_confirmation: ""
    },
    resolver: yupResolver(validationSchema)
  });

  const { handleSubmit, reset } = methods;

  const handleSubmitForm = handleSubmit(async (values) => {
    try {
      await updatePassword(values);
      toast.success("رمز عبور با موفقیت تغییر کرد");
      reset();
    } catch {
      toast.error("خطا در تغییر رمز عبور");
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <TextField size="medium" fullWidth name="password" type="password" label="رمز عبور فعلی" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="new_password" type="password" label="رمز عبور جدید" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="new_password_confirmation" type="password" label="تایید رمز عبور" />
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
