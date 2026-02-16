"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "./list-item";
import { currency } from "lib";
import { useCart } from "@/contexts/CartContext";

interface CheckoutSummaryProps {
  onProceed?: () => void;
  loading?: boolean;
}

export default function CheckoutSummary({ onProceed, loading }: CheckoutSummaryProps) {
  const { cart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.sku.price * item.quantity, 0);

  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        p: 3,
        backgroundColor: theme.palette.grey[50],
        border: `1px solid ${theme.palette.divider}`
      })}>
      <ListItem title="جمع کل" value={total} />
      <ListItem title="هزینه ارسال" />
      <ListItem title="مالیات" value={0} />
      <ListItem title="تخفیف" />

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">{currency(total)}</Typography>

      <Stack direction="row" spacing={2} mt={3}>
        <TextField size="small" placeholder="کد تخفیف" variant="outlined" fullWidth />

        <Button size="small" variant="outlined" color="primary">
          اعمال
        </Button>
      </Stack>

      {onProceed && (
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={onProceed}
          disabled={loading}
          type="button"
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'ادامه فرآیند خرید'}
        </Button>
      )}
    </Card>
  );
}
