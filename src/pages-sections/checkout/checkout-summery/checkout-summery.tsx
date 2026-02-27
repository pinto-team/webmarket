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
import { t } from "@/i18n/t";

interface CheckoutSummaryProps {
    onProceed?: () => void;
    loading?: boolean;
}

export default function CheckoutSummary({ onProceed, loading }: CheckoutSummaryProps) {
    const { cart } = useCart();

    const total = cart.reduce((acc, item) => acc + item.sku.price * item.quantity, 0);
    const currencyLabel = t("products.currencyLabel"); // "تومان"

    return (
        <Card
            elevation={0}
            sx={(theme) => ({
                p: 3,
                backgroundColor: theme.palette.grey[50],
                border: `1px solid ${theme.palette.divider}`,
            })}
        >
            <ListItem title={t("checkout.subtotal")} value={total} currencyLabel={currencyLabel} />
            <ListItem title={t("checkout.tax")} value={0} currencyLabel={currencyLabel} />
            <ListItem title={t("checkout.discount")} value={0} currencyLabel={currencyLabel} />

            <Divider sx={{ my: 2 }} />

            {/* Total with currency label */}
            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                {currency(total)}{" "}
                <Typography component="span" variant="body2" color="text.secondary">
                    {currencyLabel}
                </Typography>
            </Typography>

            <Stack direction="row" spacing={2} mt={3}>
                <TextField size="small" placeholder={t("checkout.discountCode")} variant="outlined" fullWidth />

                <Button size="small" variant="outlined" color="primary">
                    {t("common.apply")}
                </Button>
            </Stack>

            {onProceed && (
                <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    onClick={onProceed}
                    disabled={!!loading}
                    type="button"
                    sx={{ mt: 2, minHeight: 48 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : t("checkout.proceedToCheckout")}
                </Button>
            )}
        </Card>
    );
}