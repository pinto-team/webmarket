"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Grid from "@mui/material/Grid";
import { Box, CircularProgress } from "@mui/material";

import { t } from "@/i18n/t";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses } from "@/hooks/useAddresses";
import { useSnackbar } from "notistack";
import { orderService } from "@/services/order.service";
import { getLoginUrl } from "@/utils/auth-navigation";

import AddressDisplay from "../address-section/address-display";
import AddressModal from "../address-section/address-modal";
import ShipmentList from "../shipment-items/shipment-list";
import CheckoutSummary from "../checkout-summery";
import {toEnglishNumber} from "@/utils/persian";

export default function CheckoutPageView() {
    const router = useRouter();
    const { cart, loading: cartLoading } = useCart();
    const { isAuthenticated } = useAuth();
    const { addresses, loading: addressLoading, refetch } = useAddresses();
    const { enqueueSnackbar } = useSnackbar();

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace(getLoginUrl({ next: "/checkout" }));
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(addresses[0].id);
        }
    }, [addresses, selectedAddressId]);

    const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId) || null;

    const handleProceedToPayment = async () => {
        if (!selectedAddressId) {
            enqueueSnackbar(t("checkout.selectAddressWarning"), { variant: "warning" });
            setIsModalOpen(true);
            return;
        }

        if (cart.length === 0) {
            enqueueSnackbar(t("cart.isEmpty"), { variant: "warning" });
            return;
        }

        setLoading(true);

        try {
            const order = await orderService.createOrder({
                address_id: selectedAddressId,
                customer_name: selectedAddress?.title || "",
                customer_mobile: selectedAddress?.mobile ? toEnglishNumber(selectedAddress.mobile) : "",            });

            if (order.gateways && order.gateways.length > 0) {
                localStorage.setItem(
                    "checkout_gateways",
                    JSON.stringify({
                        gateway_type: order.gateway_type,
                        gateways: order.gateways,
                        requires_shop_gateway: order.requires_shop_gateway,
                    })
                );
            }

            router.push(`/payment?orderId=${order.id}`);
        } catch (err: any) {
            enqueueSnackbar(err?.response?.data?.message || t("errors.general"), { variant: "error" });
            setLoading(false);
        }
    };

    if (cartLoading || addressLoading) {
        return (
            <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Grid container flexWrap="wrap-reverse" spacing={3}>
                <Grid size={{ md: 8, xs: 12 }}>
                    <AddressDisplay address={selectedAddress} onEdit={() => setIsModalOpen(true)} />
                    <ShipmentList items={cart} />
                </Grid>

                <Grid size={{ md: 4, xs: 12 }}>
                    <CheckoutSummary onProceed={handleProceedToPayment} loading={loading} />
                </Grid>
            </Grid>

            <AddressModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
                onRefresh={refetch}
            />
        </>
    );
}
