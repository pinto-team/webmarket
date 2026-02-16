"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h4" mb={2}>
        خطا در بارگذاری محصول
      </Typography>
      <Typography color="text.secondary" mb={4}>
        متأسفانه مشکلی در بارگذاری اطلاعات محصول پیش آمد.
      </Typography>
      <Box display="flex" gap={2} justifyContent="center">
        <Button variant="contained" onClick={reset}>
          تلاش مجدد
        </Button>
        <Button variant="outlined" component={Link} href="/">
          بازگشت به صفحه اصلی
        </Button>
      </Box>
    </Container>
  );
}
