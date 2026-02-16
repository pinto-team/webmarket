import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import FlexBetween from "components/flex-box/flex-between";
import { currency } from "lib";
import type { OrderResource } from "@/types/order.types";

type Props = { order: OrderResource };

export default function OrderSummery({ order }: Props) {
  const address = order.customer_address;
  const addressText = address
    ? `${address.region?.title || ''} - ${address.district || ''} - ${address.street || ''}`
    : 'آدرس ثبت نشده';

  return (
    <Grid container spacing={3}>
      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "grey.100" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            آدرس تحویل
          </Typography>

          <Typography variant="body1">{addressText}</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {order.customer_name} - {order.customer_mobile}
          </Typography>
        </Card>
      </Grid>

      <Grid size={{ md: 6, xs: 12 }}>
        <Card elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "grey.100" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            خلاصه سفارش
          </Typography>

          <ListItem title="جمع کل:" value={currency(order.total_price)} />
          <ListItem title="هزینه ارسال:" value={currency(order.cargo_price)} />
          <ListItem title="تخفیف:" value={currency(order.off_price)} />

          <Divider sx={{ mb: 1 }} />

          <FlexBetween mb={2}>
            <Typography variant="h6">مبلغ پرداختی</Typography>
            <Typography variant="h6">{currency(order.paid_price)}</Typography>
          </FlexBetween>

          {order.coupon_code && (
            <Typography variant="body2" color="text.secondary">
              کد تخفیف: {order.coupon_code}
            </Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

function ListItem({ title, value }: { title: string; value: string }) {
  return (
    <FlexBetween mb={1}>
      <Typography color="text.secondary" variant="body1">
        {title}
      </Typography>

      <Typography variant="h6">{value}</Typography>
    </FlexBetween>
  );
}
