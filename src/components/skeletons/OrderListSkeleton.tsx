import { Box } from "@mui/material";
import OrderSkeleton from "./OrderSkeleton";

export default function OrderListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, i) => (
        <OrderSkeleton key={i} />
      ))}
    </Box>
  );
}
