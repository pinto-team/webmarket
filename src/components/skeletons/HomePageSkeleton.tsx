import { Box, Container, Skeleton, Stack } from "@mui/material";

export default function HomePageSkeleton() {
  return (
    <Box>
      {/* Hero Slider Skeleton */}
      <Skeleton variant="rectangular" height={400} sx={{ mb: 4 }} />

      <Container>
        {/* Section Title Skeleton */}
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />

        {/* Product Grid Skeleton */}
        <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
          {[1, 2, 3, 4].map((i) => (
            <Box key={i} flex={1}>
              <Skeleton variant="rectangular" height={200} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))}
        </Stack>

        {/* FAQ Section Skeleton */}
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Stack spacing={2} sx={{ mb: 6 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={60} />
          ))}
        </Stack>

        {/* Blog Section Skeleton */}
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Stack direction="row" spacing={2}>
          {[1, 2, 3].map((i) => (
            <Box key={i} flex={1}>
              <Skeleton variant="rectangular" height={180} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="70%" />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
