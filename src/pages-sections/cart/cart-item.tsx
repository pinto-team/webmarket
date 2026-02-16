import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import Delete from "@mui/icons-material/Delete";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import Inventory from "@mui/icons-material/Inventory";
import LocalShipping from "@mui/icons-material/LocalShipping";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ImageIcon from "@mui/icons-material/Image";

import { useCart } from "@/contexts/CartContext";
import { cartService } from "@/services/cart.service";
import { currency } from "lib";
import { ContentWrapper, ImageWrapper, QuantityButton, Wrapper, RemoveIconWrapper, InfoRow, PriceSection, QuantityWrapper, BottomSection } from "./styles";
import { CartItemResource } from "@/types/product.types";
import { toPersianNumber } from "@/utils/persian";
import { ProductImage } from "@/components/common/ProductImage";

// =========================================================
type Props = { item: CartItemResource };
// =========================================================

const calculateDeliveryDate = (days: number): string => {
  if (!days || days === 0) return 'نامشخص';
  
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + days);
  
  try {
    return deliveryDate.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    const year = deliveryDate.getFullYear();
    const month = deliveryDate.getMonth() + 1;
    const day = deliveryDate.getDate();
    return `${year}/${month}/${day}`;
  }
};

export default function CartItem({ item }: Props) {
  const { id, sku, quantity, product } = item;
  const deliveryDate = sku?.delivery ? calculateDeliveryDate(sku.delivery) : null;
  const productCode = product?.code || sku.product?.code || cartService.getProductCodeForSku(sku.id) || sku.code;

  const { updateQuantity, removeItem } = useCart();

  const handleCartAmountChange = (amount: number) => () => {
    if (amount === 0) {
      removeItem(id);
    } else {
      updateQuantity(id, amount);
    }
  };

  return (
    <Wrapper elevation={0}>
      <RemoveIconWrapper>
        <IconButton size="small" onClick={handleCartAmountChange(0)}>
          <Delete fontSize="small" color="error" />
        </IconButton>
      </RemoveIconWrapper>
      <ImageWrapper>
        <ProductImage
          product={sku.product || sku}
          alt={sku.title}
          width={180}
          height={180}
          size="180x180"
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      </ImageWrapper>
      <ContentWrapper>
        <div>
          <Link href={`/products/${productCode}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" fontSize={18} fontWeight={500} gutterBottom>
              {sku.title}
            </Typography>
          </Link>

          <InfoRow>
            <span className="info-item">
              <VerifiedUser />
              گارانتی
            </span>
            <span className="info-item">
              <Inventory />
              موجود
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
          <Link href={`/products/${productCode}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
            نمایش جزئیات
            <ChevronLeft fontSize="small" />
          </Link>

          <PriceSection>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              حداکثر
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {currency(sku.price)}
            </Typography>
          </PriceSection>

          <QuantityWrapper>
            <QuantityButton onClick={handleCartAmountChange(quantity + 1)} disabled={quantity === sku.stock}>
              <Add fontSize="small" />
            </QuantityButton>
            <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>{toPersianNumber(quantity)}</Typography>
            <QuantityButton onClick={handleCartAmountChange(quantity - 1)} disabled={quantity === 1}>
              <Remove fontSize="small" />
            </QuantityButton>
          </QuantityWrapper>
        </BottomSection>
      </ContentWrapper>
    </Wrapper>
  );
}
