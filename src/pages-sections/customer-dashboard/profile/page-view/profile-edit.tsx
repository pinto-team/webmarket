import { Fragment, useMemo } from "react";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import ProfileEditForm from "../edit-form";
import ProfilePicUpload from "../profile-pic-upload";
import PasswordChangeForm from "../password-change-form";
import ProfileOptionsForm from "../profile-options-form";
import DashboardHeader from "../../dashboard-header";

import type { UserResource } from "@/types/auth.types";
import { t } from "@/i18n/t";
import { getServerImageUrl } from "@/utils/imageUtils";

type Props = { user: UserResource };

export function ProfileEditPageView({ user }: Props) {
    const fallbackAvatar = "/assets/images/avatars/001-man.svg";

    const avatarUrl = useMemo(() => {
        // ✅ proxy-only; if missing -> fallback local svg
        const url = getServerImageUrl(user, "200x200", 75);
        return url && !url.includes("placeholder") ? url : fallbackAvatar;
    }, [user]);

    return (
        <Fragment>
            <DashboardHeader href="/profile" title={t("profile.editProfile")} />

            <Card sx={{ padding: { xs: 3, sm: 4 }, mb: 3 }}>
                <ProfilePicUpload image={avatarUrl} />

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