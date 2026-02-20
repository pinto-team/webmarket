import Link from "next/link";
// GLOBAL CUSTOM COMPONENTS
import ProductImage from "@/components/common/ProductImage";
// LOCAL CUSTOM COMPONENTS
import HoverActions from "./hover-actions";
import ProductTitle from "../product-title";
import ProductPrice from "../product-price";
import DiscountChip from "../discount-chip";
import ProductRating from "../product-rating";
// STYLED COMPONENTS
import { ContentWrapper, ImgBox, StyledRoot } from "./styles";
// CUSTOM DATA MODEL


// ============================================================
interface Props {
  product: any;
  hideRating?: boolean;
  showProductSize?: boolean;
}
// ============================================================

export default function ProductCard6({ hideRating, product }: Props) {
  const { discount, slug, title, price, rating } = product;

  return (
    <StyledRoot>
      <ImgBox>
        {/* DISCOUNT PERCENT CHIP IF AVAILABLE */}
        <DiscountChip discount={discount} shape="square" />

        {/* PRODUCT IMAGE / THUMBNAIL */}
        <Link href={`/products/${slug}`}>
          <ProductImage
            product={product}
            alt={title}
            width={550}
            height={550}
            size="550x550"
            style={{ height: 190, objectFit: "contain", display: "block" }}
          />
        </Link>

        {/* HOVER ACTION ICONS */}
        <HoverActions product={product} />
      </ImgBox>

      <ContentWrapper>
        {/* PRODUCT PRICE WITH DISCOUNT */}
        <ProductPrice discount={discount} price={price} />

        {/* PRODUCT NAME / TITLE */}
        <ProductTitle slug={slug} title={title} />

        {/* PRODUCT RATINGS IF AVAILABLE */}
        <ProductRating rating={rating} showRating={!hideRating} />
      </ContentWrapper>
    </StyledRoot>
  );
}
