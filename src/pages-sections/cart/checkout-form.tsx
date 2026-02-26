"use client";

import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { FlexBetween } from "components/flex-box";
import { currency } from "lib";

import { t } from "@/i18n/t";
import { getLoginUrl } from "@/utils/auth-navigation";
import { toPersianNumber } from "@/utils/persian";

export default function CheckoutForm() {
    const router = useRouter();
    const { cart } = useCart();
    const { isAuthenticated } = useAuth();

    const currencyLabel = t("products.currencyLabel"); // مثلا: "تومان"

    const subtotal = cart.reduce(
        (acc, item) => acc + item.sku.price * item.quantity,
        0
    );

    const shipping = 0;
    const total = subtotal + shipping;

    const itemCount = cart.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    const handleProceed = () => {
        if (!isAuthenticated) {
            router.push(getLoginUrl({ modal: true, next: "/checkout" }));
            return;
        }
        router.push("/checkout");
    };

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

            {/* Subtotal */}
            <FlexBetween mb={1}>
                <Typography variant="body2" color="text.secondary">
                    {t("checkout.subtotal")} (
                    {toPersianNumber(itemCount)} {t("cart.items")})
                </Typography>

                <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                    {currency(subtotal)}{" "}
                    <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                    >
                        {currencyLabel}
                    </Typography>
                </Typography>
            </FlexBetween>

            {/* Shipping */}
            <FlexBetween mb={2}>
                <Typography variant="body2" color="text.secondary">
                    {t("checkout.shipping")}
                </Typography>

                <Typography
                    variant="body2"
                    color={shipping === 0 ? "success.main" : "text.primary"}
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {shipping === 0 ? (
                        t("productDetail.freeExpressShipping")
                    ) : (
                        <>
                            {currency(shipping)}{" "}
                            <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                            >
                                {currencyLabel}
                            </Typography>
                        </>
                    )}
                </Typography>
            </FlexBetween>

            <Divider sx={{ mb: 2 }} />

            {/* Total */}
            <FlexBetween mb={3}>
                <Typography variant="h6">
                    {t("checkout.total")}
                </Typography>

                <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {currency(total)}{" "}
                    <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                    >
                        {currencyLabel}
                    </Typography>
                </Typography>
            </FlexBetween>

            <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleProceed}
                disabled={cart.length === 0}
            >
                {t("cart.proceedToCheckout")}
            </Button>
        </Card>
    );
}