"use client";

import { Box, Card, Typography, Divider, Stack } from "@mui/material";
import { OrderResource, CargoMethodSelection } from "@/types/order.types";
import CargoMethodSelector from "./CargoMethodSelector";
import { formatPersianPrice, toPersianNumber } from "@/utils/persian";
import { t } from "@/i18n/t";

interface OrderDraftSummaryProps {
    order: OrderResource;
    cargoSelections: CargoMethodSelection[];
    onCargoChange: (shipmentId: number, methodId: number) => void;
}

export default function OrderDraftSummary({
                                              order,
                                              cargoSelections,
                                              onCargoChange,
                                          }: OrderDraftSummaryProps) {

    const currency = t("products.currencyLabel");

    return (
        <Box>
            {order.shipments.map((shipment) => (
                <Card key={shipment.id} sx={{ mb: 2, p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {shipment.shop.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {shipment.type_label} {t("common.dash")} {shipment.code}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {shipment.items.map((item) => (
                        <Stack
                            key={item.id}
                            direction="row"
                            justifyContent="space-between"
                            mb={1}
                        >
                            <Typography>
                                {item.sku.title} {t("common.multiply")}{" "}
                                {toPersianNumber(item.quantity)}
                            </Typography>

                            <Typography fontWeight={600}>
                                {formatPersianPrice(item.price)} {currency}
                            </Typography>
                        </Stack>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                        {t("checkout.selectShippingMethod")}
                    </Typography>

                    <CargoMethodSelector
                        shipment={shipment}
                        selectedMethodId={
                            cargoSelections.find(
                                (s) => s.shipment_id === shipment.id
                            )?.shop_cargo_method_id || null
                        }
                        onChange={(methodId) => onCargoChange(shipment.id, methodId)}
                    />
                </Card>
            ))}

            <Card sx={{ p: 2, bgcolor: "primary.light" }}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">
                        {t("checkout.total")}
                    </Typography>

                    <Typography variant="h6" fontWeight={700}>
                        {formatPersianPrice(order.total_price)} {currency}
                    </Typography>
                </Stack>
            </Card>
        </Box>
    );
}
