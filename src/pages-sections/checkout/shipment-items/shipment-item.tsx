"use client";

import Link from "next/link";
import { Box, Card, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import Inventory from "@mui/icons-material/Inventory";

import ProductImage from "@/components/common/ProductImage";

import { CartItemResource } from "@/types/product.types";
import { cartService } from "@/services/cart.service";
import { formatPersianPrice, toPersianNumber, formatPersianDateLong } from "@/utils/persian";
import { t } from "@/i18n/t";

interface ShipmentItemProps {
    item: CartItemResource;
}

const calculateDeliveryDate = (days: number): string | null => {
    if (!days || days === 0) return null;

    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + days);

    return formatPersianDateLong(deliveryDate);
};

export default function ShipmentItem({ item }: ShipmentItemProps) {
    const { sku, quantity, product } = item;

    const deliveryDays = sku?.delivery || 0;
    const price = sku?.price || 0;
    const total = price * quantity;

    const productCode =
        product?.code ||
        sku?.product?.code ||
        cartService.getProductCodeForSku(sku.id) ||
        sku?.code ||
        "";

    const href = productCode ? `/products/${productCode}` : null;

    const deliveryDate = calculateDeliveryDate(deliveryDays);
    const currencyLabel = t("products.currencyLabel");

    // entity preference: sku.product first, then sku
    const imageEntity = sku?.product || sku;

    return (
        <Card
            elevation={0}
            sx={{
                overflow: "hidden",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                position: "relative",
                borderRadius: 3,
                mb: 2,
                p: { xs: 1.5, sm: 2 },
                bgcolor: "grey.50",
                border: 1,
                borderColor: "divider",
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: { xs: 120, sm: 180 },
                    height: { xs: 120, sm: 180 },
                    minWidth: { xs: 120, sm: 180 },
                    position: "relative",
                    bgcolor: "grey.100",
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <ProductImage
                    entity={imageEntity}
                    alt={sku?.title || "product"}
                    size="300x300"
                    loading="eager"
                    fallback="icon"
                    noWrapper
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                    }}
                />
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 1.5,
                    minWidth: 0,
                }}
            >
                <div>
                    {href ? (
                        <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
                            <Typography variant="h6" fontSize={{ xs: 16, sm: 18 }} fontWeight={500} gutterBottom>
                                {toPersianNumber(sku?.title || "")}
                            </Typography>
                        </Link>
                    ) : (
                        <Typography variant="h6" fontSize={{ xs: 16, sm: 18 }} fontWeight={500} gutterBottom>
                            {toPersianNumber(sku?.title || "")}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: { xs: 1.5, sm: 3 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            color: "text.secondary",
                            flexWrap: "wrap",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <VerifiedUser sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                            {t("cartItem.warranty")}
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Inventory sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                            {t("cartItem.inStock")}
                        </Box>

                        {deliveryDate && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <LocalShippingIcon sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
                                {deliveryDate}
                            </Box>
                        )}
                    </Box>
                </div>



                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: "grey.100",
                        borderRadius: 2,
                        mt: 1,
                        flexWrap: "wrap",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {t("cartItem.quantityLabel", { qty: toPersianNumber(quantity) })}
                    </Typography>

                    <Typography variant="h6" fontWeight={600}>
                        {formatPersianPrice(total)} {currencyLabel}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
}