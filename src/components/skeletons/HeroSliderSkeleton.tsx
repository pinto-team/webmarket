import { Skeleton } from "@mui/material";

export default function HeroSliderSkeleton() {
  return (
    <Skeleton 
      variant="rectangular" 
      height={400}
      sx={{ 
        width: '100%',
        borderRadius: 2
      }} 
    />
  );
}
