import Link from "next/link";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
// GLOBAL CUSTOM COMPONENTS
import ProductImage from "@/components/common/ProductImage";

// CUSTOM UTILS LIBRARY FUNCTIONS
import { calculateDiscount, currency } from "lib";
// STYLED COMPONENTS
import { Content, PriceText, StyledRoot } from "./styles";
// CUSTOM DATA MODEL


// ==============================================================
type Props = { product: any };
// ==============================================================

export default function ProductCard15({ product }: Props) {
  const { slug, title, price, discount } = product;

  return (
    <StyledRoot>
      <Link href={`/products/${slug}`}>
        <ProductImage
          product={product}
          alt={title}
          width={260}
          height={280}
          size="260x280"
        />
      </Link>

      <Content>
        <div>
          <Typography noWrap variant="h3" className="title">
            {title}
          </Typography>

          <p className="offer">10% off</p>

          <PriceText>
            {calculateDiscount(price, discount)}
            {discount ? <span className="base-price">{currency(price)}</span> : null}
          </PriceText>
        </div>

        <div>
          <AddToCart product={product} />
        </div>
      </Content>
    </StyledRoot>
  );
}
