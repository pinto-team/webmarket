"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ShopErrorPage() {
  const router = useRouter();

  const handleRetry = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
        gap={3}
      >
        <Typography variant="h3" color="error">
          خطا در بارگذاری اطلاعات
        </Typography>
        <Typography variant="body1" color="text.secondary">
          متأسفانه امکان دریافت اطلاعات فروشگاه وجود ندارد.
          لطفاً اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید.
        </Typography>
        <Button variant="contained" size="large" onClick={handleRetry}>
          تلاش مجدد
        </Button>
      </Box>
    </Container>
  );
}
