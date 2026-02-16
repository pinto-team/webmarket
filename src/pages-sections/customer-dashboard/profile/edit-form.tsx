"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { FormProvider, TextField } from "components/form-hook";
import { useProfile } from "@/hooks/useProfile";
import type { UserResource } from "@/types/auth.types";

const validationSchema = yup.object().shape({
  mobile: yup.string().matches(/^9[0-9]{9}$/, "شماره موبایل نامعتبر است").required("موبایل الزامی است"),
  birth_year: yup.number().min(1300, "سال نامعتبر است").max(1404, "سال نامعتبر است").required("سال تولد الزامی است"),
  birth_month: yup.number().min(1).max(12).required("ماه تولد الزامی است"),
  birth_day: yup.number().min(1).max(31).required("روز تولد الزامی است")
});

type Props = { user: UserResource };

export default function ProfileEditForm({ user }: Props) {
  const { updateProfile, loading } = useProfile();

  const methods = useForm({
    defaultValues: {
      mobile: user.mobile || "",
      birth_year: user.birth_year || 1370,
      birth_month: user.birth_month || 1,
      birth_day: user.birth_day || 1
    },
    resolver: yupResolver(validationSchema)
  });

  const { handleSubmit } = methods;

  const handleSubmitForm = handleSubmit(async (values) => {
    try {
      await updateProfile(values);
      toast.success("پروفایل با موفقیت بروزرسانی شد");
    } catch {
      toast.error("خطا در بروزرسانی پروفایل");
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Grid container spacing={3}>
        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="mobile" label="موبایل" placeholder="9123456789" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="birth_year" type="number" label="سال تولد" placeholder="1370" />
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="birth_month" type="number" label="ماه تولد" select>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <TextField size="medium" fullWidth name="birth_day" type="number" label="روز تولد" select>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={12}>
          <Button
            disableElevation
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading}>
            ذخیره تغییرات
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
