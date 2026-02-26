"use client";

import { useState } from "react";
import { Box, Card, Button, Typography, CircularProgress } from "@mui/material";
import { GatewayResource } from "@/types/gateway.types";
import PaymentGatewaySelector from "./PaymentGatewaySelector";
import OrderTimer from "./OrderTimer";
import { formatPersianPrice } from "@/utils/persian";
import { t } from "@/i18n/t";

interface PaymentFinalizationProps {
    orderCode: string;
    gateways: GatewayResource[];
    gatewayType: string;
    totalPrice: number;
    expiresAt: Date | string | null;
    onSubmit: (gatewayId: number) => void;
    loading?: boolean;
}

export default function PaymentFinalization({
                                                orderCode,
                                                gateways,
                                                gatewayType,
                                                totalPrice,
                                                expiresAt,
                                                onSubmit,
                                                loading,
                                            }: PaymentFinalizationProps) {
    const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null);

    const handleSubmit = () => {
        if (selectedGatewayId == null) return;
        onSubmit(selectedGatewayId);
    };

    const currencyLabel = t("products.currencyLabel"); // مثلا: "تومان"

    return (
        <Box>
            <OrderTimer expiresAt={expiresAt} />

            <Card sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    {t("payment.orderLabel", { code: orderCode })}
                </Typography>

                <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary"
                    mb={3}
                    sx={{ whiteSpace: "nowrap" }}
                >
                    {t("payment.totalLabel")} {formatPersianPrice(totalPrice)}{" "}
                    <Typography component="span" variant="body2" color="text.secondary">
                        {currencyLabel}
                    </Typography>
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    {t("payment.selectGateway")}
                </Typography>

                <PaymentGatewaySelector
                    gateways={gateways}
                    selectedGatewayId={selectedGatewayId}
                    onChange={setSelectedGatewayId}
                />

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={selectedGatewayId == null || !!loading}
                    sx={{ mt: 3, minHeight: 48 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : t("payment.proceed")}
                </Button>
            </Card>
        </Box>
    );
}