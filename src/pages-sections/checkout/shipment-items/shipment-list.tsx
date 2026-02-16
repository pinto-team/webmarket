"use client";

import { Box, Typography } from "@mui/material";
import { CartItemResource } from "@/types/product.types";
import ShipmentItem from "./shipment-item";

interface ShipmentListProps {
  items: CartItemResource[];
}

export default function ShipmentList({ items }: ShipmentListProps) {
  if (items.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">سبد خرید خالی است</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        اقلام سبد خرید
      </Typography>
      {items.map((item) => (
        <ShipmentItem key={item.id} item={item} />
      ))}
    </Box>
  );
}
