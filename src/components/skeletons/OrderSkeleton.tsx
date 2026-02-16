import { Box, Card, Skeleton, Stack } from "@mui/material";

export default function OrderSkeleton() {
  return (
    <Card sx={{ p: 3, mb: 2 }}>
      <Stack spacing={2}>
        <Skeleton variant="text" width="40%" height={32} />
        <Skeleton variant="text" width="30%" height={24} />
        <Skeleton variant="rectangular" height={100} />
        <Stack direction="row" justifyContent="space-between">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="20%" />
        </Stack>
      </Stack>
    </Card>
  );
}
