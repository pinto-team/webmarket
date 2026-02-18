"use client";

import { Fragment } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CreditCard from "icons/CreditCard";
import DashboardHeader from "../../dashboard-header";
import { t } from "@/i18n/t";

export function PaymentMethodsPageView() {
    return (
        <Fragment>
            <DashboardHeader
                Icon={CreditCard}
                title={t("dashboard.paymentMethods")}
            />

            <Box py={8} textAlign="center">
                <CreditCard
                    sx={{ fontSize: 80, color: "grey.300", mb: 2 }}
                />

                <Typography
                    variant="h6"
                    color="text.secondary"
                    mb={1}
                >
                    {t("common.loading")}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.disabled"
                >
                    {t("common.noData")}
                </Typography>
            </Box>
        </Fragment>
    );
}
