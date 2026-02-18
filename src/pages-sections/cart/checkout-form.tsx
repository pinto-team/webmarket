"use client";

import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useCart } from "@/contexts/CartContext";
import { FlexBetween } from "components/flex-box";
import { currency } from "lib";

import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

export default function CheckoutForm() {
    const router = useRouter();
    const { cart } = useCart();

    const subtotal = cart.reduce((acc, item) => acc + item.sku.price * item.quantity, 0);
    const shipping = 0;
    const total = subtotal + shipping;
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Card
            elevation={0}
            sx={{
                padding: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "grey.50",
            }}
        >
            <Typography variant="h6" mb={2}>
                {t("checkout.orderSummary")}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <FlexBetween mb={1}>
                <Typography variant="body2" color="text.secondary">
                    {t("checkout.subtotal")} ({toPersianNumber(itemCount)} {t("cart.items")})
                </Typography>
                <Typography variant="body2">{currency(subtotal)}</Typography>
            </FlexBetween>

            <FlexBetween mb={2}>
                <Typography variant="body2" color="text.secondary">
                    {t("checkout.shipping")}
                </Typography>
                <Typography variant="body2" color="success.main">
                    {shipping === 0 ? t("productDetail.freeExpressShipping") : currency(shipping)}
                </Typography>
            </FlexBetween>

            <Divider sx={{ mb: 2 }} />

            <FlexBetween mb={3}>
                <Typography variant="h6">{t("checkout.total")}</Typography>
                <Typography variant="h6" color="primary.main">
                    {currency(total)}
                </Typography>
            </FlexBetween>

            <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => router.push("/checkout")}
                disabled={cart.length === 0}
            >
                {t("cart.proceedToCheckout")}
            </Button>
        </Card>
    );
}
