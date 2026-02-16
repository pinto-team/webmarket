"use client";

import { Fragment } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CreditCard from "icons/CreditCard";
import DashboardHeader from "../../dashboard-header";

export function PaymentMethodsPageView() {
  return (
    <Fragment>
      <DashboardHeader Icon={CreditCard} title="روشهای پرداخت" />

      <Box py={8} textAlign="center">
        <CreditCard sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" mb={1}>
          به زودی
        </Typography>
        <Typography variant="body2" color="text.disabled">
          این قابلیت به زودی فعال خواهد شد
        </Typography>
      </Box>
    </Fragment>
  );
}
