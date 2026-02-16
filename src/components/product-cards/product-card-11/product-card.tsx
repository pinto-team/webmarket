import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import { ProductImage } from "components/common/ProductImage";
// STYLED COMPONENTS
import { CardRoot, PriceText, SaleBadge } from "./styles";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { calculateDiscount, currency } from "lib";
import { toPersianNumber } from "@/utils/numberFormatter";
// CUSTOM DATA MODEL


// ==============================================================
type Props = { product: any };
// ==============================================================

export default function ProductCard11({ product }: Props) {
  const { title, brands } = product;
  
  // Get price and discount from product or first SKU
  const price = product.price || product.skus?.[0]?.price || 0;
  const discount = product.discount || product.skus?.[0]?.discount || 0;

  const hasDiscount = discount > 0;
  const brandName = brands && brands.length > 0 ? brands[0].title : 'بدون برند';

  return (
    <CardRoot elevation={0}>
      {hasDiscount && (
        <SaleBadge>
          <p>فروش ویژه</p>
        </SaleBadge>
      )}

      <div className="img-wrapper">
        <ProductImage product={product} alt={title} width={340} height={340} size="340x340" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <div className="content">
        {/* PRODUCT TITLE & REGULAR PRICE */}
        <div className="flex">
          <Typography noWrap variant="body1" fontWeight={600} fontSize={18}>
            {toPersianNumber(title)}
          </Typography>

          {hasDiscount && <PriceText>{currency(price)}</PriceText>}
        </div>

        {/* BRAND & SALE PRICE */}
        <div className="flex">
          <Typography noWrap variant="body1" color="grey.600">
            {brandName}
          </Typography>

          <Typography noWrap variant="body1" fontWeight={600} lineHeight={1.2} fontSize={18}>
            {calculateDiscount(price, discount)}
          </Typography>
        </div>
      </div>
    </CardRoot>
  );
}
