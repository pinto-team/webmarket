"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Card, Typography, Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

import { orderService } from "@/services/order.service";
import type { OrderResource } from "@/types/order.types";

type Status = "loading" | "success" | "failed";

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState<Status>("loading");
    const [order, setOrder] = useState<OrderResource | null>(null);

    useEffect(() => {
        const fetchOrderStatus = async () => {
            const orderId = searchParams.get("order_id") || searchParams.get("orderId");
            const orderCode = searchParams.get("order_code") || searchParams.get("orderCode");
            const success = searchParams.get("success");

            if (!orderId && !orderCode) {
                setStatus("failed");
                return;
            }

            try {
                const orderData = await orderService.getOrder(orderId || orderCode || "");
                setOrder(orderData);

                const isSuccess = success === "true" || orderData?.status === 1;
                setStatus(isSuccess ? "success" : "failed");
            } catch (error) {
                console.error(t("payment.callback.fetchError", "خطا در دریافت وضعیت سفارش"), error);
                setStatus("failed");
            }
        };

        fetchOrderStatus();
    }, [searchParams]);

    if (status === "loading") {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    const orderCodeText =
        order?.code != null ? toPersianNumber(String(order.code)) : null;

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" p={2}>
            <Card sx={{ p: 4, maxWidth: 500, textAlign: "center" }}>
                {status === "success" ? (
                    <>
                        <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            {t("payment.callback.successTitle")}
                        </Typography>

                        <Typography variant="body1" color="text.secondary" mb={1}>
                            {t("payment.callback.successSubtitle")}
                        </Typography>

                        {orderCodeText && (
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                {t("payment.callback.orderCodeLabel")} {orderCodeText}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.push(order ? "/customer/orders" : "/")}
                        >
                            {t("payment.callback.viewOrders")}
                        </Button>
                    </>
                ) : (
                    <>
                        <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            {t("payment.callback.failedTitle")}
                        </Typography>

                        <Typography variant="body1" color="text.secondary" mb={3}>
                            {t("payment.callback.failedSubtitle")}
                        </Typography>

                        <Button variant="contained" size="large" onClick={() => router.push("/cart")}>
                            {t("payment.callback.backToCart")}
                        </Button>
                    </>
                )}
            </Card>
        </Box>
    );
}
