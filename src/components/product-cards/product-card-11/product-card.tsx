"use client";

import Typography from "@mui/material/Typography";
import { t } from "@/i18n/t";

import { CardRoot, PriceText, SaleBadge } from "./styles";

import { toPersianNumber, formatPersianPrice } from "@/utils/persian";
import ProductImage from "@/components/common/ProductImage";

type Props = { product: any };

function calcFinalPrice(price: number, discount: number) {
    if (!Number.isFinite(price) || price <= 0) return 0;
    if (!Number.isFinite(discount) || discount <= 0) return price;

    if (discount > 0 && discount <= 100) {
        return Math.max(0, Math.round(price * (1 - discount / 100)));
    }

    return Math.max(0, Math.round(price - discount));
}

export default function ProductCard11({ product }: Props) {
    const title = product?.title ?? "";
    const brands = product?.brands ?? [];

    const price = Number(product?.price ?? product?.skus?.[0]?.price ?? 0);
    const discount = Number(product?.discount ?? product?.skus?.[0]?.discount ?? 0);

    const hasDiscount = Number.isFinite(discount) && discount > 0;
    const finalPrice = calcFinalPrice(price, discount);

    const brandName =
        Array.isArray(brands) && brands.length > 0 && brands[0]?.title
            ? brands[0].title
            : t("products.noBrand");

    const altText = title || t("products.title");

    return (
        <CardRoot elevation={0}>
            {hasDiscount && (
                <SaleBadge>
                    <p>{t("products.saleBadge")}</p>
                </SaleBadge>
            )}

            <div className="img-wrapper">
                <ProductImage
                    product={product}
                    alt={altText}
                    width={340}
                    height={340}
                    size="340x340"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
            </div>

            <div className="content">
                <div className="flex">
                    <Typography noWrap variant="body1" fontWeight={600} fontSize={18}>
                        {toPersianNumber(title)}
                    </Typography>

                    {hasDiscount && (
                        <PriceText>
                            {formatPersianPrice(price)} {t("products.currencyLabel")}
                        </PriceText>
                    )}
                </div>

                <div className="flex">
                    <Typography noWrap variant="body1" color="grey.600">
                        {toPersianNumber(brandName)}
                    </Typography>

                    <Typography noWrap variant="body1" fontWeight={600} lineHeight={1.2} fontSize={18}>
                        {formatPersianPrice(finalPrice)} {t("products.currencyLabel")}
                    </Typography>
                </div>
            </div>
        </CardRoot>
    );
}
