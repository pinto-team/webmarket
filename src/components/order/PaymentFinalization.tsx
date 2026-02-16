"use client";

import { useState } from "react";
import { Box, Card, Button, Typography, Stack, CircularProgress } from "@mui/material";
import { CargoMethodSelection } from "@/types/order.types";
import { GatewayResource } from "@/types/gateway.types";
import PaymentGatewaySelector from "./PaymentGatewaySelector";
import OrderTimer from "./OrderTimer";
import { formatPersianPrice } from "@/utils/persian";

interface PaymentFinalizationProps {
  orderCode: string;
  gateways: GatewayResource[];
  gatewayType: string;
  totalPrice: number;
  expiresAt: Date | string | null;
  onSubmit: (gatewayId: number) => void;
  loading?: boolean;
}

export default function PaymentFinalization({
  orderCode,
  gateways,
  gatewayType,
  totalPrice,
  expiresAt,
  onSubmit,
  loading
}: PaymentFinalizationProps) {
  const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedGatewayId) {
      onSubmit(selectedGatewayId);
    }
  };

  return (
    <Box>
      <OrderTimer expiresAt={expiresAt} />
      
      <Card sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Order: {orderCode}
        </Typography>
        
        <Typography variant="h5" fontWeight={700} color="primary" mb={3}>
          Total: {formatPersianPrice(totalPrice)} تومان
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom>
          Select Payment Gateway:
        </Typography>
        
        <PaymentGatewaySelector
          gateways={gateways}
          selectedGatewayId={selectedGatewayId}
          onChange={setSelectedGatewayId}
        />
        
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={!selectedGatewayId || loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : "Proceed to Payment"}
        </Button>
      </Card>
    </Box>
  );
}
