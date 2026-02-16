"use client";

import { Box, Radio, RadioGroup, FormControlLabel, Typography, Stack } from "@mui/material";
import { ShipmentResource } from "@/types/order.types";
import { formatPersianPrice } from "@/utils/persian";

interface CargoMethodSelectorProps {
  shipment: ShipmentResource;
  selectedMethodId: number | null;
  onChange: (methodId: number) => void;
}

export default function CargoMethodSelector({ shipment, selectedMethodId, onChange }: CargoMethodSelectorProps) {
  if (!shipment.available_cargo_methods?.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No cargo methods available
      </Typography>
    );
  }

  const calculatePrice = (basePrice: string, perKgRate: string, weight: string) => {
    const base = parseFloat(basePrice);
    const rate = parseFloat(perKgRate);
    const w = parseFloat(weight);
    return base + rate * w;
  };

  return (
    <RadioGroup value={selectedMethodId} onChange={(e) => onChange(Number(e.target.value))}>
      {shipment.available_cargo_methods.map((method) => {
        const price = calculatePrice(method.base_price, method.per_kg_rate, shipment.weight);
        return (
          <FormControlLabel
            key={method.id}
            value={method.id}
            control={<Radio />}
            label={
              <Stack direction="row" justifyContent="space-between" width="100%">
                <Typography>{method.title}</Typography>
                <Typography fontWeight={600}>{formatPersianPrice(price)} تومان</Typography>
              </Stack>
            }
            sx={{ border: 1, borderColor: "divider", borderRadius: 1, mb: 1, px: 2 }}
          />
        );
      })}
    </RadioGroup>
  );
}
