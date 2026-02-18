import { Fragment } from "react";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import ProfileEditForm from "../edit-form";
import ProfilePicUpload from "../profile-pic-upload";
import PasswordChangeForm from "../password-change-form";
import ProfileOptionsForm from "../profile-options-form";
import DashboardHeader from "../../dashboard-header";

import type { UserResource } from "@/types/auth.types";
import { t } from "@/i18n/t";

type Props = { user: UserResource };

export function ProfileEditPageView({ user }: Props) {
    return (
        <Fragment>
            <DashboardHeader
                href="/profile"
                title={t("profile.editProfile")}
            />

            <Card sx={{ padding: { xs: 3, sm: 4 }, mb: 3 }}>
                <ProfilePicUpload
                    image={
                        user.upload?.main_url ||
                        "/assets/images/avatars/001-man.svg"
                    }
                />

                <Typography variant="h6" mb={2}>
                    {t("profile.personalInfo")}
                </Typography>

                <ProfileEditForm user={user} />
            </Card>

            <Card sx={{ padding: { xs: 3, sm: 4 }, mb: 3 }}>
                <Typography variant="h6" mb={2}>
                    {t("profile.email")}
                </Typography>

                <ProfileOptionsForm user={user} />
            </Card>

            <Card sx={{ padding: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" mb={2}>
                    {t("profile.changePassword")}
                </Typography>

                <PasswordChangeForm />
            </Card>
        </Fragment>
    );
}
