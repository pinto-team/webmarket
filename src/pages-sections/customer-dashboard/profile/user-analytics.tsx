import Image from "next/image";

import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

import { FlexBetween, FlexBox } from "components/flex-box";
import { currency } from "lib";

import { useOrderStats } from "@/hooks/useOrderStats";
import type { UserResource } from "@/types/auth.types";
import { t } from "@/i18n/t";
import { formatPersianNumber } from "@/utils/persian";

type Props = { user: UserResource };

export default function UserAnalytics({ user }: Props) {
    const { stats, loading } = useOrderStats();

    const displayName =
        user.title ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.username;

    const avatarUrl =
        user.upload?.main_url || "/assets/images/avatars/001-man.svg";

    const balance = user.wallet?.balance || 0;

    return (
        <Grid container spacing={3}>
            <Grid size={{ md: 6, xs: 12 }}>
                <Card
                    elevation={0}
                    sx={{
                        gap: 2,
                        height: "100%",
                        display: "flex",
                        border: "1px solid",
                        alignItems: "center",
                        padding: "1rem 1.5rem",
                        borderColor: "grey.100",
                    }}
                >
                    <Avatar variant="rounded" sx={{ height: 65, width: 65 }}>
                        <Image fill alt={displayName} src={avatarUrl} sizes="65px" />
                    </Avatar>

                    <FlexBetween flexWrap="wrap" flex={1}>
                        <div>
                            <Typography variant="h5">{displayName}</Typography>

                            <FlexBox alignItems="center" gap={1}>
                                <Typography variant="body1" color="text.secondary">
                                    {t("profile.balanceLabel")}
                                </Typography>

                                <Typography
                                    fontWeight={500}
                                    lineHeight={2}
                                    variant="body1"
                                    color="primary"
                                >
                                    {currency(balance)}
                                </Typography>
                            </FlexBox>
                        </div>

                        {user.status_label && (
                            <Typography variant="body1" color="text.secondary">
                                {t("profile.statusLabel")}: {user.status_label}
                            </Typography>
                        )}
                    </FlexBetween>
                </Card>
            </Grid>

            <Grid container spacing={3} size={{ md: 6, xs: 12 }}>
                <Grid size={{ lg: 3, xs: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            padding: "1rem 1.25rem",
                            borderColor: "grey.100",
                            borderStyle: "solid",
                            borderWidth: 1,
                        }}
                    >
                        {loading ? (
                            <Skeleton width={60} height={40} />
                        ) : (
                            <Typography variant="h3" color="primary">
                                {formatPersianNumber(stats.total)}
                            </Typography>
                        )}

                        <Typography
                            fontSize={13}
                            variant="body1"
                            color="text.secondary"
                            sx={{ textAlign: "center" }}
                        >
                            {t("orders.stats.all")}
                        </Typography>
                    </Card>
                </Grid>

                <Grid size={{ lg: 3, xs: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            padding: "1rem 1.25rem",
                            borderColor: "grey.100",
                            borderStyle: "solid",
                            borderWidth: 1,
                        }}
                    >
                        {loading ? (
                            <Skeleton width={60} height={40} />
                        ) : (
                            <Typography variant="h3" color="primary">
                                {formatPersianNumber(stats.awaitingDelivery)}
                            </Typography>
                        )}

                        <Typography
                            fontSize={13}
                            variant="body1"
                            color="text.secondary"
                            sx={{ textAlign: "center" }}
                        >
                            {t("orders.stats.awaitingDelivery")}
                        </Typography>
                    </Card>
                </Grid>

                <Grid size={{ lg: 3, xs: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            padding: "1rem 1.25rem",
                            borderColor: "grey.100",
                            borderStyle: "solid",
                            borderWidth: 1,
                        }}
                    >
                        {loading ? (
                            <Skeleton width={60} height={40} />
                        ) : (
                            <Typography variant="h3" color="primary">
                                {formatPersianNumber(stats.awaitingShipment)}
                            </Typography>
                        )}

                        <Typography
                            fontSize={13}
                            variant="body1"
                            color="text.secondary"
                            sx={{ textAlign: "center" }}
                        >
                            {t("orders.stats.awaitingShipment")}
                        </Typography>
                    </Card>
                </Grid>

                <Grid size={{ lg: 3, xs: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            padding: "1rem 1.25rem",
                            borderColor: "grey.100",
                            borderStyle: "solid",
                            borderWidth: 1,
                        }}
                    >
                        {loading ? (
                            <Skeleton width={60} height={40} />
                        ) : (
                            <Typography variant="h3" color="primary">
                                {formatPersianNumber(stats.awaitingPayment)}
                            </Typography>
                        )}

                        <Typography
                            fontSize={13}
                            variant="body1"
                            color="text.secondary"
                            sx={{ textAlign: "center" }}
                        >
                            {t("orders.stats.awaitingPayment")}
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}
