"use client";

import { Fragment } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";

import DashboardHeader from "../dashboard-header";
import { t } from "@/i18n/t";

export default function WishListPageView() {
    return (
        <Fragment>
            <DashboardHeader title={t("dashboard.wishlist")} Icon={Favorite} />

            <Box py={8} textAlign="center">
                <Favorite sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />

                <Typography variant="h6" color="text.secondary" mb={1}>
                    {t("common.loading")}
                </Typography>

                <Typography variant="body2" color="text.disabled">
                    {t("common.noData")}
                </Typography>
            </Box>
        </Fragment>
    );
}
