import Link from "next/link";
import Rating from "@mui/material/Rating";
// GLOBAL CUSTOM COMPONENTS
import { ProductImage } from "components/common/ProductImage";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { calculateDiscount, currency } from "lib";
// STYLED COMPONENTS
import { ImageWrapper, PriceText, Title } from "./styles";
// CUSTOM DATA MODEL


// ==============================================================
type Props = { product: any };
// ==============================================================

export default function ProductCard12({ product }: Props) {
  const { slug, title, price, discount, rating } = product;

  return (
    <Link href={`/products/${slug}`}>
      <ImageWrapper>
        <ProductImage product={product} alt={title} width={380} height={379} size="380x379" />
      </ImageWrapper>

      <div>
        <Rating readOnly value={rating} size="small" precision={0.5} />
        <Title>{title}</Title>
        <PriceText>
          {calculateDiscount(price, discount)}
          {discount ? <span className="base-price">{currency(price)}</span> : null}
        </PriceText>
      </div>
    </Link>
  );
}
