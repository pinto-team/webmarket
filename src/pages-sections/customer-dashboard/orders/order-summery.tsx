import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import FlexBetween from "components/flex-box/flex-between";
import { currency } from "lib";

import type { OrderResource } from "@/types/order.types";
import { t } from "@/i18n/t";

type Props = { order: OrderResource };

export default function OrderSummery({ order }: Props) {
    const address = order.customer_address;

    const addressText = address
        ? [address.region?.title, address.district, address.street].filter(Boolean).join(" - ")
        : t("common.unknown");

    const currencyLabel = t("products.currencyLabel"); // "تومان"

    return (
        <Grid container spacing={3}>
            <Grid size={{ md: 6, xs: 12 }}>
                <Card
                    elevation={0}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "grey.100",
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {t("checkout.shippingAddress")}
                    </Typography>

                    <Typography variant="body1">{addressText}</Typography>

                    <Typography variant="body2" color="text.secondary" mt={1}>
                        {order.customer_name} - {order.customer_mobile}
                    </Typography>
                </Card>
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
                <Card
                    elevation={0}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "grey.100",
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {t("checkout.orderSummary")}
                    </Typography>

                    <ListItem title={t("checkout.subtotal")} value={currency(order.total_price)} currencyLabel={currencyLabel} />

                    <ListItem title={t("checkout.shipping")} value={currency(order.cargo_price)} currencyLabel={currencyLabel} />

                    <ListItem title={t("checkout.discount")} value={currency(order.off_price)} currencyLabel={currencyLabel} />

                    <Divider sx={{ mb: 1 }} />

                    <FlexBetween mb={2}>
                        <Typography variant="h6">{t("checkout.total")}</Typography>

                        <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                            {currency(order.paid_price)}{" "}
                            <Typography component="span" variant="body2" color="text.secondary">
                                {currencyLabel}
                            </Typography>
                        </Typography>
                    </FlexBetween>

                    {order.coupon_code && (
                        <Typography variant="body2" color="text.secondary">
                            {t("checkout.discountCode")}: {order.coupon_code}
                        </Typography>
                    )}
                </Card>
            </Grid>
        </Grid>
    );
}

function ListItem({
                      title,
                      value,
                      currencyLabel,
                  }: {
    title: string;
    value: string;
    currencyLabel: string;
}) {
    return (
        <FlexBetween mb={1}>
            <Typography color="text.secondary" variant="body1">
                {title}
            </Typography>

            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                {value}{" "}
                <Typography component="span" variant="body2" color="text.secondary">
                    {currencyLabel}
                </Typography>
            </Typography>
        </FlexBetween>
    );
}