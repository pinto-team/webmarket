import { Fragment } from "react";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

import ProfileEditForm from "../edit-form";
import PasswordChangeForm from "../password-change-form";
import ProfileOptionsForm from "../profile-options-form";
import DashboardHeader from "../../dashboard-header";

import type { UserResource } from "@/types/auth.types";
import { t } from "@/i18n/t";

type Props = { user: UserResource };

export function ProfileEditPageView({ user }: Props) {
    return (
        <Fragment>
            <DashboardHeader href="/profile" title={t("profile.editProfile")} />

            <Card sx={{ padding: { xs: 3, sm: 4 }, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Avatar
                        src="/assets/images/avatars/avatar.svg"
                        alt="user"
                        sx={{ width: 100, height: 100 }}
                    />
                </Box>

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