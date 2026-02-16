import { Box, Card, Radio, RadioGroup, FormControlLabel, Typography, CircularProgress, Alert } from '@mui/material';
import { GatewayResource } from '@/types/gateway.types';
import Image from 'next/image';

interface GatewaySelectorProps {
  gateways: GatewayResource[];
  selectedGatewayId: number | null;
  onSelect: (gatewayId: number, isShopGateway: boolean) => void;
  loading?: boolean;
  error?: string | null;
}

export const GatewaySelector = ({ gateways, selectedGatewayId, onSelect, loading, error }: GatewaySelectorProps) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (gateways.length === 0) {
    return <Alert severity="warning">درگاه پرداختی موجود نیست</Alert>;
  }

  return (
    <RadioGroup value={selectedGatewayId} onChange={(e) => {
      const gatewayId = Number(e.target.value);
      const gateway = gateways.find(g => g.id === gatewayId);
      onSelect(gatewayId, gateway?.is_shop_specific || false);
    }}>
      {gateways.map((gateway) => (
        <Card
          key={gateway.id}
          elevation={0}
          sx={{
            mb: 2,
            p: 2,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: selectedGatewayId === gateway.id ? 'primary.main' : 'divider',
            backgroundColor: 'grey.50'
          }}
          onClick={() => onSelect(gateway.id, gateway.is_shop_specific || false)}
        >
          <FormControlLabel
            value={gateway.id}
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                {gateway.logo && gateway.logo.trim() !== '' && (
                  <Image src={gateway.logo} alt={gateway.title} width={48} height={48} />
                )}
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {gateway.title}
                  </Typography>
                  {gateway.is_shop_specific && (
                    <Typography variant="caption" color="text.secondary">
                      درگاه اختصاصی فروشگاه
                    </Typography>
                  )}
                </Box>
              </Box>
            }
            sx={{ width: '100%', m: 0 }}
          />
        </Card>
      ))}
    </RadioGroup>
  );
};
