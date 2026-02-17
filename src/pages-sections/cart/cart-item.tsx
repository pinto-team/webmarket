import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import Delete from "@mui/icons-material/Delete";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import Inventory from "@mui/icons-material/Inventory";
import LocalShipping from "@mui/icons-material/LocalShipping";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

import { useCart } from "@/contexts/CartContext";
import { cartService } from "@/services/cart.service";
import { currency } from "lib";

import {
    ContentWrapper,
    ImageWrapper,
    QuantityButton,
    Wrapper,
    RemoveIconWrapper,
    InfoRow,
    PriceSection,
    QuantityWrapper,
    BottomSection,
} from "./styles";

import type { CartItemResource } from "@/types/product.types";
import { t } from "@/i18n/t";
import { formatPersianDate, formatPersianNumber } from "@/utils/persian";
import { ProductImage } from "@/components/common/ProductImage";

type Props = { item: CartItemResource };

const calculateDeliveryDate = (days: number): string => {
    if (!Number.isFinite(days) || days <= 0) return t("cartItem.unknownDelivery");

    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + days);

    return formatPersianDate(deliveryDate, { year: "numeric", month: "long", day: "numeric" });
};

export default function CartItem({ item }: Props) {
    const { id, sku, quantity, product } = item;

    const deliveryDate = sku?.delivery ? calculateDeliveryDate(Number(sku.delivery)) : null;

    const productCode =
        product?.code ||
        sku?.product?.code ||
        cartService.getProductCodeForSku(sku.id) ||
        sku.code;

    const { updateQuantity, removeItem } = useCart();

    const handleCartAmountChange = (amount: number) => () => {
        if (amount <= 0) removeItem(id);
        else updateQuantity(id, amount);
    };

    return (
        <Wrapper elevation={0}>
            <RemoveIconWrapper>
                <IconButton size="small" onClick={handleCartAmountChange(0)} aria-label={t("common.delete")}>
                    <Delete fontSize="small" color="error" />
                </IconButton>
            </RemoveIconWrapper>

            <ImageWrapper>
                <ProductImage
                    product={sku.product || sku}
                    alt={sku.title || t("products.title")}
                    width={180}
                    height={180}
                    size="180x180"
                    style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
            </ImageWrapper>

            <ContentWrapper>
                <div>
                    <Link href={`/products/${productCode}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography variant="h6" fontSize={18} fontWeight={500} gutterBottom>
                            {sku.title}
                        </Typography>
                    </Link>

                    <InfoRow>
            <span className="info-item">
              <VerifiedUser />
                {t("cartItem.warranty")}
            </span>

                        <span className="info-item">
              <Inventory />
                            {t("products.inStock")}
            </span>

                        {deliveryDate && (
                            <span className="info-item">
                <LocalShipping />
                                {deliveryDate}
              </span>
                        )}
                    </InfoRow>
                </div>

                <BottomSection>
                    <Link
                        href={`/products/${productCode}`}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.875rem",
                        }}
                    >
                        {t("cartItem.details")}
                        <ChevronLeft fontSize="small" />
                    </Link>

                    <PriceSection>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                            {t("cartItem.max")}
                        </Typography>

                        <Typography variant="h6" fontWeight={600}>
                            {currency(Number(sku.price) || 0)}
                        </Typography>
                    </PriceSection>

                    <QuantityWrapper>
                        <QuantityButton
                            onClick={handleCartAmountChange(quantity + 1)}
                            disabled={Number.isFinite(sku.stock) && quantity >= Number(sku.stock)}
                            aria-label={t("common.add")}
                        >
                            <Add fontSize="small" />
                        </QuantityButton>

                        <Typography variant="h6" sx={{ minWidth: 30, textAlign: "center" }}>
                            {formatPersianNumber(quantity)}
                        </Typography>

                        <QuantityButton
                            onClick={handleCartAmountChange(quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label={t("common.remove", t("common.delete"))}
                        >
                            <Remove fontSize="small" />
                        </QuantityButton>
                    </QuantityWrapper>
                </BottomSection>
            </ContentWrapper>
        </Wrapper>
    );
}
