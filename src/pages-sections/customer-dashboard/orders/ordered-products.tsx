"use client";

import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { FlexBetween, FlexBox } from "components/flex-box";

import ProductImage from "@/components/common/ProductImage";
import { formatPersianDate, formatPersianPrice, toPersianNumber } from "@/utils/persian";
import { t } from "@/i18n/t";

import type { OrderResource, ShipmentItemResource } from "@/types/order.types";
import type { SkuResource } from "@/types/product.types";

type Props = { order: OrderResource };

function resolveImageEntityFromSku(sku?: SkuResource | null) {
    if (!sku) return null;

    // ✅ Prefer product image first (often present in orders)
    if (sku.product?.upload?.proxy_url) return sku.product;

    // ✅ Then sku upload
    if (sku.upload?.proxy_url) return sku;

    // ✅ Fallback to whichever exists (ProductImage may still derive url from other fields)
    return sku.product ?? sku;
}

function getUnitPrice(item: ShipmentItemResource): number {
    // ✅ Best source for unit price (per your types)
    const p = Number(item.sku_data?.price ?? NaN);
    if (Number.isFinite(p) && p > 0) return p;

    // fallback
    const fallback = Number(item.price ?? 0);
    return Number.isFinite(fallback) ? fallback : 0;
}

export default function OrderedProducts({ order }: Props) {
    const currencyLabel = t("products.currencyLabel");

    return (
        <Card
            elevation={0}
            sx={{
                p: 0,
                mb: 4,
                border: "1px solid",
                borderColor: "grey.100",
            }}
        >
            <FlexBetween px={3} py={2} flexWrap="wrap" gap={1} bgcolor="grey.50">
                <Item title={t("orders.orderNumber")} value={toPersianNumber(order.code)} />
                <Item title={t("orders.orderDate")} value={formatPersianDate(order.created_at)} />
                <Item title={t("orders.status")} value={toPersianNumber(order.status_label)} />
            </FlexBetween>

            {order.shipments.map((shipment) =>
                shipment.items.map((item) => {
                    const title = item.sku_data?.title || item.sku?.title || "";
                    const qty = Number(item.quantity || 0);

                    const unitPrice = getUnitPrice(item);
                    const lineTotal = unitPrice * qty;

                    const imageEntity = resolveImageEntityFromSku(item.sku);

                    return (
                        <FlexBetween key={item.id} px={2} py={1} flexWrap="wrap" gap={1}>
                            <FlexBox gap={2} alignItems="center">
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        height: 60,
                                        width: 60,
                                        backgroundColor: "grey.50",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                    }}
                                >
                                    <ProductImage
                                        // ✅ key fix: choose entity that actually has upload.proxy_url
                                        entity={imageEntity}
                                        alt={title || "product"}
                                        size="60x60"
                                        loading="lazy"
                                        fallback="icon"
                                        noWrapper
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            display: "block",
                                        }}
                                    />
                                </Avatar>

                                <div style={{ minWidth: 0 }}>
                                    <Typography noWrap variant="h6">
                                        {toPersianNumber(title)}
                                    </Typography>

                                    {/* ✅ Quantity */}
                                    <Typography lineHeight={1.8} variant="body2" color="text.secondary">
                                        {t("cartItem.quantityLabel", { qty: toPersianNumber(qty) })}
                                    </Typography>

                                    {/* ✅ Unit price */}
                                    <Typography lineHeight={1.8} variant="body2" color="text.secondary">
                                        {t("products.unitPrice")}: {formatPersianPrice(unitPrice)} {currencyLabel}
                                    </Typography>

                                    {/* ✅ Line total */}
                                    <Typography lineHeight={1.8} variant="body2" color="text.secondary">
                                        {t("checkout.subtotal")}: {formatPersianPrice(lineTotal)} {currencyLabel}
                                    </Typography>
                                </div>
                            </FlexBox>
                        </FlexBetween>
                    );
                })
            )}
        </Card>
    );
}

function Item({ title, value }: { title: string; value: string }) {
    return (
        <FlexBox gap={1} alignItems="center">
            <Typography variant="body1" color="text.secondary">
                {title}
            </Typography>
            <Typography variant="body1">{value}</Typography>
        </FlexBox>
    );
}