"use client";

import { Box, Card, Typography, Divider, Stack } from "@mui/material";
import { OrderResource, CargoMethodSelection } from "@/types/order.types";
import CargoMethodSelector from "./CargoMethodSelector";
import { formatPersianPrice, toPersianNumber } from "@/utils/persian";

interface OrderDraftSummaryProps {
  order: OrderResource;
  cargoSelections: CargoMethodSelection[];
  onCargoChange: (shipmentId: number, methodId: number) => void;
}

export default function OrderDraftSummary({ order, cargoSelections, onCargoChange }: OrderDraftSummaryProps) {
  return (
    <Box>
      {order.shipments.map((shipment) => (
        <Card key={shipment.id} sx={{ mb: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {shipment.shop.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {shipment.type_label} - {shipment.code}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {shipment.items.map((item) => (
            <Stack key={item.id} direction="row" justifyContent="space-between" mb={1}>
              <Typography>{item.sku.title} × {toPersianNumber(item.quantity)}</Typography>
              <Typography fontWeight={600}>{formatPersianPrice(item.price)} تومان</Typography>
            </Stack>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Select Shipping Method:
          </Typography>
          <CargoMethodSelector
            shipment={shipment}
            selectedMethodId={cargoSelections.find(s => s.shipment_id === shipment.id)?.shop_cargo_method_id || null}
            onChange={(methodId) => onCargoChange(shipment.id, methodId)}
          />
        </Card>
      ))}
      
      <Card sx={{ p: 2, bgcolor: "primary.light" }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" fontWeight={700}>{formatPersianPrice(order.total_price)} تومان</Typography>
        </Stack>
      </Card>
    </Box>
  );
}
