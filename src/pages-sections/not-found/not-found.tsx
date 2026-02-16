"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function NotFound() {
  const router = useRouter();

  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: 700, color: "primary.main", mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          صفحه مورد نظر یافت نشد
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="outlined" onClick={() => router.push("/")} size="large">
            بازگشت به خانه
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
