"use client";

import { Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { OrderResource } from "@/types/order.types";
import { printOrder } from "@/utils/orderPrint";

interface OrderPrintButtonProps {
  order: OrderResource;
}

export default function OrderPrintButton({ order }: OrderPrintButtonProps) {
  return (
    <Button
      variant="outlined"
      startIcon={<PrintIcon />}
      onClick={() => printOrder(order)}
    >
      Print Order
    </Button>
  );
}
