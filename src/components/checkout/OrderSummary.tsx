"use client";

import { Box, Button, Card, CircularProgress, Divider, Typography } from "@mui/material";

import { t } from "@/i18n/t";
import { currency } from "@/lib";
import { toPersianNumber } from "@/utils/persian";

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

const safeNumber = (v: number | null | undefined) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

const Money = ({
                   amountText,
                   currencyLabel,
                   variant = "body2",
                   color,
                   prefix,
               }: {
    amountText: string;
    currencyLabel: string;
    variant?: "body2" | "h6";
    color?: any;
    prefix?: string;
}) => {
    return (
        <Typography variant={variant} color={color} sx={{ whiteSpace: "nowrap" }}>
            {prefix ? `${prefix}` : ""}
            {amountText}{" "}
            <Typography component="span" variant="body2" color="text.secondary">
                {currencyLabel}
            </Typography>
        </Typography>
    );
};

export const OrderSummary = ({
                                 orderCode,
                                 subtotal,
                                 shipping,
                                 discount,
                                 total,
                                 onProceed,
                                 loading = false,
                                 disabled = false,
                             }: OrderSummaryProps) => {
    const code = orderCode?.trim() || "-";

    const subtotalSafe = safeNumber(subtotal);
    const shippingSafe = safeNumber(shipping);
    const discountSafe = safeNumber(discount);
    const totalSafe = safeNumber(total);

    const currencyLabel = t("products.currencyLabel"); // "تومان"

    return (
        <Card
            elevation={0}
            sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "grey.50",
            }}
        >
            <Typography variant="h6" gutterBottom>
                {t("checkout.orderSummary")}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
                {t("checkout.orderNumber")}: {toPersianNumber(code)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {/* Subtotal */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">{t("checkout.subtotal")}</Typography>
                    <Money amountText={currency(subtotalSafe)} currencyLabel={currencyLabel} />
                </Box>

                {/* Shipping */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2">{t("checkout.shipping")}</Typography>

                    {shippingSafe === 0 ? (
                        <Typography variant="body2" color="success.main" sx={{ whiteSpace: "nowrap" }}>
                            {t("checkout.freeShipping")}
                        </Typography>
                    ) : (
                        <Money amountText={currency(shippingSafe)} currencyLabel={currencyLabel} />
                    )}
                </Box>

                {/* Discount */}
                {discountSafe > 0 && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "success.main",
                        }}
                    >
                        <Typography variant="body2">{t("checkout.discount")}</Typography>
                        <Money
                            amountText={currency(discountSafe)}
                            currencyLabel={currencyLabel}
                            color="success.main"
                            prefix="-"
                        />
                    </Box>
                )}

                <Divider />

                {/* Total */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">{t("checkout.total")}</Typography>
                    <Money
                        amountText={currency(totalSafe)}
                        currencyLabel={currencyLabel}
                        variant="h6"
                        color="primary"
                    />
                </Box>
            </Box>

            {!!onProceed && (
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onProceed}
                    disabled={disabled || loading}
                    sx={{ mt: 3, height: 40 }}
                >
                    {loading ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CircularProgress size={20} color="inherit" />
                            <Typography variant="body2" sx={{ color: "inherit" }}>
                                {t("common.loading")}
                            </Typography>
                        </Box>
                    ) : (
                        t("checkout.proceedToCheckout")
                    )}
                </Button>
            )}
        </Card>
    );
};