"use client";

import { Fragment } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";
import DashboardHeader from "../dashboard-header";

export default function WishListPageView() {
  return (
    <Fragment>
      <DashboardHeader title="علاقه‌مندی‌ها" Icon={Favorite} />

      <Box py={8} textAlign="center">
        <Favorite sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
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
