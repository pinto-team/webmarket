import Link from "next/link";
// MUI
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
// CUSTOM COMPONENTS
import Star from "icons/Star";
import AddToCart from "./add-to-cart";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { calculateDiscount, currency } from "lib";
import { toPersianNumber } from "@/utils/persian";
// STYLED COMPONENTS
import { Content, PriceText, StyledChip, StyledRoot } from "./styles";
import ProductImage from "@/components/common/ProductImage";
// CUSTOM DATA MODEL


// ==============================================================
type Props = { product: any };
// ==============================================================

export default function ProductCard14({ product }: Props) {
  const { slug, title, price, discount, rating } = product;

  return (
    <StyledRoot>
      <Link href={`/products/${slug}`}>
        <div className="img-wrapper">
          {discount > 0 && <StyledChip size="small" label={toPersianNumber(`${discount}% off`)} />}

          <ProductImage
            product={product}
            alt={title}
            width={400}
            height={400}
            size="400x400"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </Link>

      <Content>
        <Rating
          readOnly
          size="small"
          value={rating}
          icon={<Star fontSize="inherit" />}
          emptyIcon={<Star fontSize="inherit" />}
        />

        <Typography noWrap variant="body1" fontSize={16} fontWeight={500}>
          {title}
        </Typography>

        <PriceText>
          {toPersianNumber(calculateDiscount(price, discount))}
          {discount && <span className="base-price">{currency(price)}</span>}
        </PriceText>

        <AddToCart product={product} />
      </Content>
    </StyledRoot>
  );
}
