import {
    Box,
    Card,
    Radio,
    RadioGroup,
    FormControlLabel,
    Typography,
    Divider,
} from "@mui/material";

import { ShipmentResource, CargoMethodSelection } from "@/types/order.types";
import { calculateShippingCost, formatPrice } from "@/utils/shipping.utils";
import { useState } from "react";
import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

interface ShipmentSelectorProps {
    shipments: ShipmentResource[];
    orderTotal: number;
    onSelectionChange: (selections: CargoMethodSelection[]) => void;
}

export const ShipmentSelector = ({
                                     shipments,
                                     orderTotal,
                                     onSelectionChange,
                                 }: ShipmentSelectorProps) => {
    const [selections, setSelections] = useState<Record<number, number>>({});

    const handleSelect = (shipmentId: number, cargoMethodId: number) => {
        const newSelections = { ...selections, [shipmentId]: cargoMethodId };
        setSelections(newSelections);

        const cargoMethods: CargoMethodSelection[] = Object.entries(newSelections).map(
            ([sid, cmid]) => ({
                shipment_id: Number(sid),
                shop_cargo_method_id: Number(cmid),
            })
        );

        onSelectionChange(cargoMethods);
    };

    if (!shipments || shipments.length === 0) return null;

    const currency = t("products.currencyLabel");

    return (
        <Box>
            {shipments.map((shipment, index) => {
                // ✅ تعداد واقعی کالاها (بر اساس quantity)
                const shipmentQuantity =
                    shipment.items?.reduce((acc, it) => acc + (it.quantity ?? 0), 0) ?? 0;

                return (
                    <Card
                        key={shipment.id}
                        elevation={0}
                        sx={{
                            mb: 1.5,
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "grey.50",
                        }}
                    >
                        {/* Header Row */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold">
                                {t("checkout.shipmentTitle", {
                                    index: toPersianNumber(index + 1),
                                })}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ whiteSpace: "nowrap" }}
                            >
                                {toPersianNumber(shipmentQuantity)} {t("checkout.items")}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        {!shipment.available_cargo_methods ||
                        shipment.available_cargo_methods.length === 0 ? (
                            <Typography variant="body2" color="error">
                                {t("checkout.noCargoMethods")}
                            </Typography>
                        ) : (
                            <RadioGroup
                                value={selections[shipment.id] ?? ""}
                                onChange={(e) =>
                                    handleSelect(shipment.id, Number(e.target.value))
                                }
                            >
                                {shipment.available_cargo_methods.map((method) => {
                                    const weight = parseFloat(shipment.weight);
                                    const safeWeight = Number.isFinite(weight) ? weight : 0;

                                    const cost = calculateShippingCost(
                                        method,
                                        safeWeight,
                                        orderTotal
                                    );

                                    return (
                                        <FormControlLabel
                                            key={method.id}
                                            value={method.id}
                                            control={<Radio size="small" />}
                                            label={
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        width: "100%",
                                                        pr: 1,
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {method.title}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        fontWeight="medium"
                                                        sx={{ whiteSpace: "nowrap" }}
                                                    >
                                                        {cost === 0
                                                            ? t("checkout.freeShipping")
                                                            : `${formatPrice(cost)} ${currency}`}
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{
                                                width: "100%",
                                                m: 0,
                                                py: 0.5,
                                            }}
                                        />
                                    );
                                })}
                            </RadioGroup>
                        )}
                    </Card>
                );
            })}
        </Box>
    );
};