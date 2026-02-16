"use client";

import { Box, Radio, RadioGroup, FormControlLabel, Typography, Avatar, Stack } from "@mui/material";
import { GatewayResource } from "@/types/gateway.types";

interface PaymentGatewaySelectorProps {
  gateways: GatewayResource[];
  selectedGatewayId: number | null;
  onChange: (gatewayId: number) => void;
}

export default function PaymentGatewaySelector({ gateways, selectedGatewayId, onChange }: PaymentGatewaySelectorProps) {
  if (!gateways.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No payment gateways available
      </Typography>
    );
  }

  return (
    <RadioGroup value={selectedGatewayId} onChange={(e) => onChange(Number(e.target.value))}>
      {gateways.map((gateway) => (
        <FormControlLabel
          key={gateway.id}
          value={gateway.id}
          control={<Radio />}
          label={
            <Stack direction="row" spacing={2} alignItems="center">
              {gateway.logo && <Avatar src={gateway.logo} sx={{ width: 32, height: 32 }} />}
              <Typography>{gateway.title}</Typography>
            </Stack>
          }
          sx={{ border: 1, borderColor: "divider", borderRadius: 1, mb: 1, px: 2 }}
        />
      ))}
    </RadioGroup>
  );
}
