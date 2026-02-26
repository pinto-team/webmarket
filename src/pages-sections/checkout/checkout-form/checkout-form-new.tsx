"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Alert, CircularProgress, Box } from "@mui/material";
import { useOrderCreate } from "@/hooks/useOrderCreate";
import { useOrderUpdate } from "@/hooks/useOrderUpdate";
import { useAuth } from "@/hooks/useAuth";
import type { OrderCreateRequest, CargoMethodSelection, OrderResource } from "@/types/order.types";
import { OrderDraftSummary, PaymentFinalization } from "@/components/order";
import { validateMobile, validateCustomerName, validateCargoSelections } from "@/utils/orderValidation";
import { CardRoot } from "./styles";
import { t } from "@/i18n/t";
import { toEnglishNumber } from "@/utils/persian";

function onlyDigits(value: string) {
    return value.replace(/[^\d۰-۹]/g, "");
}

export default function CheckoutFormNew() {
    const router = useRouter();
    const { user, isLoading, isAuthenticated } = useAuth();

    const { createOrder, loading: creating, error: createError } = useOrderCreate();
    const { updateOrder, loading: updating, error: updateError } = useOrderUpdate();

    const [step, setStep] = useState<"create" | "finalize">("create");
    const [draftOrder, setDraftOrder] = useState<OrderResource | null>(null);
    const [cargoSelections, setCargoSelections] = useState<CargoMethodSelection[]>([]);
    const [customerData, setCustomerData] = useState({
        customer_name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : "",
        customer_mobile: user?.mobile || "",
        customer_email: user?.email || "",
    });

    // ✅ اگر لاگین نیست: مستقیم برو خانه (نه /login)
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/");
        }
    }, [isLoading, isAuthenticated, router]);

    // ✅ وقتی user بعداً لود شد، customerData را sync کن
    useEffect(() => {
        if (!user) return;

        setCustomerData((prev) => ({
            ...prev,
            customer_name:
                user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : prev.customer_name,
            // keep as-is for UI; we normalize on validate/submit
            customer_mobile: user.mobile || prev.customer_mobile,
            customer_email: user.email || prev.customer_email,
        }));
    }, [user]);

    // تا وقتی وضعیت auth مشخص نشده یا user نداریم، چیزی رندر نکن
    if (isLoading || !user) return null;

    const handleCreateOrder = async () => {
        const normalizedName = (customerData.customer_name || "").trim();
        const normalizedMobile = toEnglishNumber(onlyDigits(customerData.customer_mobile || ""));
        const normalizedEmail = (customerData.customer_email || "").trim();

        if (!validateCustomerName(normalizedName)) {
            alert(t("checkout.validation.nameLength")); // e.g. "نام باید بین ۱ تا ۶۰ کاراکتر باشد"
            return;
        }
        if (!validateMobile(normalizedMobile)) {
            alert(t("checkout.validation.mobileFormat")); // e.g. "فرمت موبایل نامعتبر است"
            return;
        }

        const request: OrderCreateRequest = {
            customer_name: normalizedName,
            customer_mobile: normalizedMobile,
            customer_email: normalizedEmail || undefined,
        };

        const order = await createOrder(request);
        if (order) {
            setDraftOrder(order);
            setStep("finalize");
        }
    };

    const handleCargoChange = (shipmentId: number, methodId: number) => {
        setCargoSelections((prev) => {
            const existing = prev.find((s) => s.shipment_id === shipmentId);
            if (existing) {
                return prev.map((s) =>
                    s.shipment_id === shipmentId ? { shipment_id: shipmentId, shop_cargo_method_id: methodId } : s
                );
            }
            return [...prev, { shipment_id: shipmentId, shop_cargo_method_id: methodId }];
        });
    };

    const handlePayment = async (gatewayId: number) => {
        if (!draftOrder) return;

        if (!validateCargoSelections(draftOrder.shipments, cargoSelections)) {
            alert(t("checkout.validation.selectCargoForAllShipments"));
            return;
        }

        const updateData = {
            cargo_methods: cargoSelections,
            ...(draftOrder.gateway_type === "platform" ? { gateway_id: gatewayId } : { shop_gateway_id: gatewayId }),
        };

        const result = await updateOrder(draftOrder.code, updateData);
        if (result?.payment_url) {
            window.location.href = result.payment_url;
        }
    };

    if (step === "create") {
        return (
            <CardRoot elevation={0}>
                <Typography variant="h5" mb={2}>
                    {t("checkout.customerInformation")}
                </Typography>

                {createError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {createError}
                    </Alert>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <input
                        type="text"
                        placeholder={t("checkout.fullName")}
                        value={customerData.customer_name}
                        onChange={(e) => setCustomerData((prev) => ({ ...prev, customer_name: e.target.value }))}
                        style={{ padding: "12px", fontSize: "16px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />

                    <input
                        type="text"
                        placeholder={t("checkout.mobilePlaceholder")} // e.g. "موبایل (۰۹xxxxxxxxx)"
                        value={customerData.customer_mobile}
                        onChange={(e) =>
                            setCustomerData((prev) => ({ ...prev, customer_mobile: onlyDigits(e.target.value) }))
                        }
                        inputMode="numeric"
                        style={{
                            padding: "12px",
                            fontSize: "16px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            direction: "ltr",
                        }}
                    />

                    <input
                        type="email"
                        placeholder={t("checkout.emailOptional")}
                        value={customerData.customer_email}
                        onChange={(e) => setCustomerData((prev) => ({ ...prev, customer_email: e.target.value }))}
                        style={{ padding: "12px", fontSize: "16px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />

                    <Button variant="contained" size="large" onClick={handleCreateOrder} disabled={creating}>
                        {creating ? <CircularProgress size={24} /> : t("checkout.createOrder")}
                    </Button>
                </Box>
            </CardRoot>
        );
    }

    if (step === "finalize" && draftOrder) {
        return (
            <Box>
                {updateError && (
                    <Alert severity="error" sx={{ my: 2 }}>
                        {updateError}
                    </Alert>
                )}

                <OrderDraftSummary
                    order={draftOrder}
                    cargoSelections={cargoSelections}
                    onCargoChange={handleCargoChange}
                />

                <PaymentFinalization
                    orderCode={draftOrder.code}
                    gateways={draftOrder.gateways || []}
                    gatewayType={draftOrder.gateway_type || ""}
                    totalPrice={draftOrder.total_price}
                    expiresAt={null}
                    onSubmit={handlePayment}
                    loading={updating}
                />
            </Box>
        );
    }

    return null;
}