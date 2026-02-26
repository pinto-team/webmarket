"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";

import { GatewaySelector } from "@/components/checkout/GatewaySelector";
import { ShipmentSelector } from "@/components/checkout/ShipmentSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CountdownTimer } from "@/components/checkout/CountdownTimer";

import { useCountdown } from "@/hooks/useCountdown";
import { usePaymentGatewayRequest } from "@/hooks/usePaymentGatewayRequest";
import { orderService } from "@/services/order.service";
import type { OrderResource, CargoMethodSelection } from "@/types/order.types";
import type { AvailableGatewaysResponse } from "@/types/payment.types";
import { t } from "@/i18n/t";

import { calculateShippingCost } from "@/utils/shipping.utils";

function SectionCard({
                         title,
                         children,
                         mb = 4,
                     }: {
    title: string;
    children: React.ReactNode;
    mb?: number;
}) {
    return (
        <Box sx={{ mb }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    lineHeight: 1.4,
                }}
            >
                {title}
            </Typography>

            {children}
        </Box>
    );
}

export default function PaymentPageViewNew() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const { requestPaymentGateway, loading: paymentLoading } = usePaymentGatewayRequest();

    const orderIdParam = searchParams.get("orderId");
    const orderId = orderIdParam ? Number(orderIdParam) : null;

    const [selectedGatewayId, setSelectedGatewayId] = useState<number | null>(null);
    const [selectedShopGatewayId, setSelectedShopGatewayId] = useState<number | null>(null);
    const [cargoSelections, setCargoSelections] = useState<CargoMethodSelection[]>([]);
    const [order, setOrder] = useState<OrderResource | null>(null);
    const [gatewayData, setGatewayData] = useState<AvailableGatewaysResponse | null>(null);
    const [orderLoading, setOrderLoading] = useState(true);

    const { seconds, isExpired } = useCountdown(600);

    const selectedAnyGateway = selectedGatewayId != null || selectedShopGatewayId != null;

    // ✅ Map: shipment_id -> selected cargo method id
    const selectedCargoByShipment = useMemo(() => {
        const map = new Map<number, number>();
        for (const s of cargoSelections) map.set(s.shipment_id, s.shop_cargo_method_id);
        return map;
    }, [cargoSelections]);

    // ✅ Compute total shipping cost based on selected cargo methods
    const computedShipping = useMemo(() => {
        if (!order?.shipments?.length) return 0;

        let sum = 0;

        for (const shipment of order.shipments) {
            const selectedMethodId = selectedCargoByShipment.get(shipment.id);
            if (!selectedMethodId) continue;

            const method = shipment.available_cargo_methods?.find((m) => m.id === selectedMethodId);
            if (!method) continue;

            const weight = Number.parseFloat(shipment.weight);
            const safeWeight = Number.isFinite(weight) ? weight : 0;

            sum += calculateShippingCost(method, safeWeight, order.total_price);
        }

        return sum;
    }, [order, selectedCargoByShipment]);

    // ✅ Require selecting a method for ALL shipments (if shipments exist)
    const allShipmentsSelected = useMemo(() => {
        if (!order?.shipments?.length) return true;
        return cargoSelections.length === order.shipments.length;
    }, [order?.shipments?.length, cargoSelections.length]);

    // ✅ Summary computed from selections (NOT from order.cargo_price / order.paid_price)
    const summary = useMemo(() => {
        if (!order) return null;

        const itemsTotal = order.total_price; // total of items (without shipping)
        const discount = order.off_price ?? 0;

        const total = itemsTotal + computedShipping - discount;

        return {
            orderCode: order.code,
            subtotal: itemsTotal,
            shipping: computedShipping,
            discount,
            total,
        };
    }, [order, computedShipping]);

    useEffect(() => {
        if (!isExpired) return;

        enqueueSnackbar(t("payment.timeout"), { variant: "error" });
        router.push("/cart");
    }, [isExpired, enqueueSnackbar, router]);

    useEffect(() => {
        if (!orderId) {
            router.push("/checkout");
            return;
        }

        let isMounted = true;

        (async () => {
            setOrderLoading(true);
            try {
                const orderData = await orderService.getOrder(orderId);
                if (!isMounted) return;

                setOrder(orderData);

                setGatewayData({
                    gateway_type: orderData.gateway_type || "",
                    gateways: orderData.gateways || [],
                    requires_shop_gateway: orderData.requires_shop_gateway || false,
                });
            } catch (err) {
                enqueueSnackbar(t("payment.loadOrderFailed"), { variant: "error" });
                router.push("/checkout");
            } finally {
                if (isMounted) setOrderLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [orderId, enqueueSnackbar, router]);

    const handleProceedToPayment = async () => {
        if (!orderId) return;

        if (!selectedAnyGateway) {
            enqueueSnackbar(t("payment.selectGatewayWarning"), { variant: "warning" });
            return;
        }

        if (order?.shipments?.length && cargoSelections.length !== order.shipments.length) {
            enqueueSnackbar(t("payment.selectAllShipmentsWarning"), { variant: "warning" });
            return;
        }

        try {
            const response = await requestPaymentGateway(orderId, {
                cargo_methods: cargoSelections,
                gateway_id: selectedGatewayId ?? undefined,
                shop_gateway_id: selectedShopGatewayId ?? undefined,
            });

            if (response?.payment_url) {
                window.location.href = response.payment_url;
                return;
            }

            enqueueSnackbar(t("payment.paymentLinkFailed"), { variant: "error" });
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

    if (!order || !summary) return null;

    return (
        <Grid container spacing={3} alignItems="flex-start">
            {/* Main */}
            <Grid size={{ md: 8, xs: 12 }} sx={{ mt: { md: 1.3, xs: 0 } }}>
                {order.shipments?.length ? (
                    <SectionCard title={t("payment.selectShippingMethod")}>
                        <ShipmentSelector
                            shipments={order.shipments}
                            orderTotal={order.total_price}
                            onSelectionChange={setCargoSelections}
                        />
                    </SectionCard>
                ) : null}

                <SectionCard title={t("payment.selectGateway")} mb={0}>
                    <GatewaySelector
                        gateways={gatewayData?.gateways || []}
                        selectedGatewayId={selectedGatewayId ?? selectedShopGatewayId}
                        onSelect={handleGatewaySelect}
                        loading={false}
                        error={!gatewayData?.gateways?.length ? t("payment.noGateways") : null}
                    />
                </SectionCard>
            </Grid>

            {/* Summary */}
            <Grid size={{ md: 4, xs: 12 }}>
                <Box sx={{ position: { md: "sticky", xs: "static" }, top: { md: 16, xs: "auto" } }}>
                    {/* Timer aligned with the summary card */}
                    <Box sx={{ mb: 2.5, display: "flex", justifyContent: "flex-start" }}>
                        <CountdownTimer seconds={seconds} />
                    </Box>

                    <OrderSummary
                        orderCode={summary.orderCode}
                        subtotal={summary.subtotal}
                        shipping={summary.shipping}
                        discount={summary.discount}
                        total={summary.total}
                        onProceed={handleProceedToPayment}
                        loading={paymentLoading}
                        // ✅ disable until gateway selected + all shipments selected
                        disabled={!selectedAnyGateway || !allShipmentsSelected || paymentLoading}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}