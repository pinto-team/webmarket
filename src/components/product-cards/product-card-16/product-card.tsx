import Link from "next/link";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import { ProductImage } from "components/common/ProductImage";
// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import DiscountChip from "../discount-chip";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { calculateDiscount, currency } from "lib";
// STYLED COMPONENTS
import { PriceText, StyledRoot } from "./styles";
// CUSTOM DATA MODEL


// ==============================================================
type Props = { product: any };
// ==============================================================

export default function ProductCard16({ product }: Props) {
  const { slug, title, price, discount, rating } = product;

  return (
    <StyledRoot>
      <Link href={`/products/${slug}`}>
        <div className="img-wrapper">
          <ProductImage product={product} alt={title} width={380} height={379} size="380x379" />
          {discount ? <DiscountChip discount={discount} sx={{ left: 20, top: 20 }} /> : null}
        </div>
      </Link>

      <div className="content">
        <div>
          <Link href={`/products/${slug}`}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {title}
            </Typography>
          </Link>

          <Rating readOnly value={rating} size="small" precision={0.5} />

          <PriceText>
            {calculateDiscount(price, discount)}
            {discount && <span className="base-price">{currency(price)}</span>}
          </PriceText>
        </div>

        {/* ADD TO CART BUTTON */}
        <AddToCart product={product} />
      </div>
    </StyledRoot>
  );
}
