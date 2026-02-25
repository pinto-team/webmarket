"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FlexBox from "components/flex-box/flex-box";

import { formatPersianPrice } from "@/utils/persian";
import { t } from "@/i18n/t";

// ==============================================================
type Props = { price: number; discount: number };
// ==============================================================

function calcFinalPrice(price: number, discount: number) {
    if (!Number.isFinite(price) || price <= 0) return 0;
    if (!Number.isFinite(discount) || discount <= 0) return price;

    // percent discount
    if (discount > 0 && discount <= 100) {
        return Math.max(0, Math.round(price * (1 - discount / 100)));
    }

    // amount discount
    return Math.max(0, Math.round(price - discount));
}

export default function ProductPrice({ discount, price }: Props) {
    const p = Number(price ?? 0);
    const d = Number(discount ?? 0);

    const hasDiscount = Number.isFinite(d) && d > 0;
    const finalPrice = calcFinalPrice(p, d);

    const currencyLabel = t("products.currencyLabel") || "تومان";

    return (
        <FlexBox alignItems="center" gap={1} mt={0.5}>
            <Typography color="primary" fontWeight={600}>
                {formatPersianPrice(finalPrice)} {currencyLabel}
            </Typography>

            {hasDiscount && (
                <Box component="del" fontSize={12} fontWeight={500} color="grey.400">
                    {formatPersianPrice(p)} {currencyLabel}
                </Box>
            )}
        </FlexBox>
    );
}