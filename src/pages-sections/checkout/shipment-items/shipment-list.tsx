"use client";

import { Box, Typography } from "@mui/material";
import { t } from "@/i18n/t";
import { CartItemResource } from "@/types/product.types";
import ShipmentItem from "./shipment-item";

interface ShipmentListProps {
    items: CartItemResource[];
}

export default function ShipmentList({ items }: ShipmentListProps) {
    if (items.length === 0) {
        return (
            <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                    {t("cart.isEmpty")}
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
                {t("cart.itemsTitle")}
            </Typography>

            {items.map((item) => (
                <ShipmentItem key={item.id} item={item} />
            ))}
        </Box>
    );
}
