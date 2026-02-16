import { Box, Container, Skeleton, Stack } from "@mui/material";

export default function ProductDetailsSkeleton() {
  return (
    <Container sx={{ my: 4 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box flex={1}>
          <Skeleton variant="rectangular" height={400} />
        </Box>
        <Box flex={1}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="30%" height={50} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
      </Stack>
      <Box mt={4}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={200} />
      </Box>
    </Container>
  );
}
