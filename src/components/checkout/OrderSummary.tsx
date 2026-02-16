import { Box, Card, Typography, Divider, Button, CircularProgress } from '@mui/material';

interface OrderSummaryProps {
  orderCode: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onProceed?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const OrderSummary = ({ orderCode, subtotal, shipping, discount, total, onProceed, loading, disabled }: OrderSummaryProps) => {
  const formatPrice = (price: number | null | undefined) => (price || 0).toLocaleString('fa-IR');

  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "grey.50"
      }}>
      <Typography variant="h6" gutterBottom>
        خلاصه سفارش
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        کد سفارش: {orderCode}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">مبلغ کالاها</Typography>
          <Typography variant="body2">{formatPrice(subtotal)} تومان</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">هزینه ارسال</Typography>
          <Typography variant="body2">{formatPrice(shipping)} تومان</Typography>
        </Box>

        {discount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
            <Typography variant="body2">تخفیف</Typography>
            <Typography variant="body2">-{formatPrice(discount)} تومان</Typography>
          </Box>
        )}

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">مبلغ قابل پرداخت</Typography>
          <Typography variant="h6" color="primary">
            {formatPrice(total)} تومان
          </Typography>
        </Box>
      </Box>

      {onProceed && (
        <Button
          fullWidth
          variant="contained"
          onClick={onProceed}
          disabled={disabled || loading}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'پرداخت'}
        </Button>
      )}
    </Card>
  );
};
