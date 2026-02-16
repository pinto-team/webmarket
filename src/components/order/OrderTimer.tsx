"use client";

import { Box, Typography } from "@mui/material";
import { useOrderTimer } from "@/hooks/useOrderTimer";

interface OrderTimerProps {
  expiresAt: Date | string | null;
  onExpire?: () => void;
}

export default function OrderTimer({ expiresAt, onExpire }: OrderTimerProps) {
  const { formatted, isExpired, minutes } = useOrderTimer(expiresAt);

  if (!expiresAt) return null;

  if (isExpired) {
    onExpire?.();
    return (
      <Box sx={{ p: 2, bgcolor: "error.light", borderRadius: 1 }}>
        <Typography color="error.dark" fontWeight={600}>
          Order Expired
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, bgcolor: minutes < 5 ? "warning.light" : "info.light", borderRadius: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Time Remaining
      </Typography>
      <Typography variant="h5" fontWeight={700} color={minutes < 5 ? "warning.dark" : "info.dark"}>
        {formatted}
      </Typography>
    </Box>
  );
}
