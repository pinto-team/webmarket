"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid";
import { Box, Typography, CircularProgress, Card } from "@mui/material";
import { useSnackbar } from "notistack";

import { GatewaySelector } from "@/components/checkout/GatewaySelector";
import { ShipmentSelector } from "@/components/checkout/ShipmentSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CountdownTimer } from "@/components/checkout/CountdownTimer";

import { useCountdown } from "@/hooks/useCountdown";
import { usePaymentGatewayRequest } from "@/hooks/usePaymentGatewayRequest";
import { orderService } from "@/services/order.service";
import { OrderResource, CargoMethodSelection } from "@/types/order.types";
import { AvailableGatewaysResponse } from "@/types/payment.types";
import { t } from "@/i18n/t";

export default function PaymentPageViewNew() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const { requestPaymentGateway, loading: paymentLoading } = usePaymentGatewayRequest();

    const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null);
    const [selectedShopGatewayId, setSelectedShopGatewayId] = useState<number | null>(null);
    const [cargoSelections, setCargoSelections] = useState<CargoMethodSelection[]>([]);
    const [order, setOrder] = useState<OrderResource | null>(null);
    const [gatewayData, setGatewayData] = useState<AvailableGatewaysResponse | null>(null);
    const [orderLoading, setOrderLoading] = useState(true);

    const { seconds, isExpired } = useCountdown(600);
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        if (isExpired) {
            enqueueSnackbar(t("payment.timeout"), { variant: "error" });
            router.push("/cart");
        }
    }, [isExpired]);

    useEffect(() => {
        if (!orderId) {
            router.push("/checkout");
            return;
        }

        const loadOrder = async () => {
            try {
                const orderData = await orderService.getOrder(Number(orderId));
                setOrder(orderData);

                if (orderData.gateways && orderData.gateways.length > 0) {
                    setGatewayData({
                        gateway_type: orderData.gateway_type || "",
                        gateways: orderData.gateways,
                        requires_shop_gateway: orderData.requires_shop_gateway || false,
                    });
                }
            } catch (err) {
                enqueueSnackbar(t("payment.loadOrderFailed"), { variant: "error" });
                router.push("/checkout");
            } finally {
                setOrderLoading(false);
            }
        };

        loadOrder();
    }, [orderId]);

    const handleProceedToPayment = async () => {
        if (!selectedGatewayId && !selectedShopGatewayId) {
            enqueueSnackbar(t("payment.selectGatewayWarning"), { variant: "warning" });
            return;
        }

        if (order?.shipments?.length && cargoSelections.length !== order.shipments.length) {
            enqueueSnackbar(t("payment.selectAllShipmentsWarning"), { variant: "warning" });
            return;
        }

        if (!orderId) return;

        try {
            const response = await requestPaymentGateway(Number(orderId), {
                cargo_methods: cargoSelections,
                gateway_id: selectedGatewayId || undefined,
                shop_gateway_id: selectedShopGatewayId || undefined,
            });

            if (response?.payment_url) {
                window.location.href = response.payment_url;
            } else {
                enqueueSnackbar(t("payment.paymentLinkFailed"), { variant: "error" });
            }
        } catch (err) {
            enqueueSnackbar(t("payment.createPaymentFailed"), { variant: "error" });
        }
    };

    const handleGatewaySelect = (gatewayId: number, isShopGateway: boolean) => {
        if (isShopGateway) {
            setSelectedShopGatewayId(gatewayId);
            setSelectedGatewayId(null);
        } else {
            setSelectedGatewayId(gatewayId);
            setSelectedShopGatewayId(null);
        }
    };

    if (orderLoading) {
        return (
            <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress />
            </Box>
        );
    }

    if (!order) return null;

    return (
        <>
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Typography variant="h4">{t("payment.title")}</Typography>
                <CountdownTimer seconds={seconds} />
            </Box>

            <Grid container flexWrap="wrap-reverse" spacing={3}>
                <Grid size={{ md: 8, xs: 12 }}>
                    {order.shipments && order.shipments.length > 0 && (
                        <Card
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                border: "1px solid",
                                borderColor: "divider",
                                backgroundColor: "grey.50",
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                {t("payment.selectShippingMethod")}
                            </Typography>

                            <ShipmentSelector
                                shipments={order.shipments}
                                orderTotal={order.total_price}
                                onSelectionChange={setCargoSelections}
                            />
                        </Card>
                    )}

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
                            {t("payment.selectGateway")}
                        </Typography>

                        <GatewaySelector
                            gateways={gatewayData?.gateways || []}
                            selectedGatewayId={selectedGatewayId || selectedShopGatewayId}
                            onSelect={handleGatewaySelect}
                            loading={false}
                            error={!gatewayData?.gateways?.length ? t("payment.noGateways") : null}
                        />
                    </Card>
                </Grid>

                <Grid size={{ md: 4, xs: 12 }}>
                    <OrderSummary
                        orderCode={order.code}
                        subtotal={order.total_price - order.cargo_price + order.off_price}
                        shipping={order.cargo_price}
                        discount={order.off_price}
                        total={order.paid_price}
                        onProceed={handleProceedToPayment}
                        loading={paymentLoading}
                        disabled={(!selectedGatewayId && !selectedShopGatewayId) || paymentLoading}
                    />
                </Grid>
            </Grid>
        </>
    );
}
