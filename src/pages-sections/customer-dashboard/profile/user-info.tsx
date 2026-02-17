import Link from "next/link";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import FlexBox from "components/flex-box/flex-box";
import type { UserResource } from "@/types/auth.types";

import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

type Props = { user: UserResource };

export default function UserInfo({ user }: Props) {
    const birthDate =
        user.birth_year && user.birth_month && user.birth_day
            ? `${toPersianNumber(user.birth_day)}/${toPersianNumber(user.birth_month)}/${toPersianNumber(user.birth_year)}`
            : t("common.noData");

    return (
        <Link href="/profile/edit">
            <Card
                elevation={0}
                sx={{
                    marginTop: 3,
                    display: "flex",
                    flexWrap: "wrap",
                    border: "1px solid",
                    borderColor: "grey.100",
                    padding: "0.75rem 1.5rem",
                    flexDirection: { md: "row", xs: "column" },
                    alignItems: { md: "center", xs: "flex-start" },
                    justifyContent: { md: "space-between", xs: "flex-start" },
                }}
            >
                <TableRowItem title={t("profile.firstName")} value={user.first_name || t("common.noData")} />
                <TableRowItem title={t("profile.lastName")} value={user.last_name || t("common.noData")} />

                {user.email && <TableRowItem title={t("profile.email")} value={user.email} />}

                <TableRowItem
                    title={t("footer.phoneLabel")}
                    value={user.mobile ? toPersianNumber(user.mobile) : t("common.noData")}
                />

                <TableRowItem
                    title={t("profile.userCode")}
                    value={user.username ? toPersianNumber(user.username) : t("common.noData")}
                />

                <TableRowItem title={t("profile.birthDate")} value={birthDate} />
            </Card>
        </Link>
    );
}

function TableRowItem({ title, value }: { title: string; value: string }) {
    return (
        <FlexBox flexDirection="column" p={1}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                {title}
            </Typography>
            <span>{value}</span>
        </FlexBox>
    );
}
