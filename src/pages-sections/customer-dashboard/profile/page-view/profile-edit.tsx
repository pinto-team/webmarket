import { Fragment } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import ProfileEditForm from "../edit-form";
import ProfilePicUpload from "../profile-pic-upload";
import PasswordChangeForm from "../password-change-form";
import ProfileOptionsForm from "../profile-options-form";
import DashboardHeader from "../../dashboard-header";
import type { UserResource } from "@/types/auth.types";

type Props = { user: UserResource };

export function ProfileEditPageView({ user }: Props) {
  return (
    <Fragment>
      <DashboardHeader href="/profile" title="ویرایش پروفایل" />

      <Card sx={{ padding: { xs: 3, sm: 4 }, mb: 3 }}>
        <ProfilePicUpload image={user.upload?.main_url || "/assets/images/avatars/001-man.svg"} />
        <Typography variant="h6" mb={2}>اطلاعات پروفایل</Typography>
        <ProfileEditForm user={user} />
      </Card>

      <Card sx={{ padding: { xs: 3, sm: 4 }, mb: 3 }}>
        <Typography variant="h6" mb={2}>ایمیل</Typography>
        <ProfileOptionsForm user={user} />
      </Card>

      <Card sx={{ padding: { xs: 3, sm: 4 } }}>
        <Typography variant="h6" mb={2}>تغییر رمز عبور</Typography>
        <PasswordChangeForm />
      </Card>
    </Fragment>
  );
}
