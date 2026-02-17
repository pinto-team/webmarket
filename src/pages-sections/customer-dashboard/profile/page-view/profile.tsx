import { Fragment } from "react";
import User3 from "icons/User3";

import UserInfo from "../user-info";
import UserAnalytics from "../user-analytics";
import DashboardHeader from "../../dashboard-header";

import type { UserResource } from "@/types/auth.types";
import { t } from "@/i18n/t";

type Props = { user: UserResource };

export function ProfilePageView({ user }: Props) {
    return (
        <Fragment>
            <DashboardHeader
                title={t("profile.title")}
                Icon={User3}
            />
            <UserAnalytics user={user} />
            <UserInfo user={user} />
        </Fragment>
    );
}
