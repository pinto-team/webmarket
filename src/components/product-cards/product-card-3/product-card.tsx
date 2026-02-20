import Link from "next/link";
// GLOBAL CUSTOM COMPONENTS
import ProductImage from "@/components/common/ProductImage";
// LOCAL CUSTOM COMPONENTS
import HoverActions from "./hover-actions";
import DiscountChip from "../discount-chip";
import ProductPrice from "../product-price";
import ProductTitle from "../product-title";
import ProductRating from "../product-rating";
// STYLED COMPONENTS
import { ContentWrapper, ImageBox, ImageWrapper, StyledRoot } from "./styles";
// CUSTOM DATA MODEL


// ====================================================================
type Props = { product: any };
// ====================================================================

export default function ProductCard3({ product }: Props) {
  const { discount, title, price, rating, slug } = product;

  return (
    <StyledRoot>
      <ImageWrapper>
        {/* DISCOUNT PERCENT CHIP IF AVAILABLE */}
        <DiscountChip discount={discount} />

        {/* PRODUCT IMAGE / THUMBNAIL */}
        <ImageBox className="hoverImgBox">
          <Link href={`/products/${slug}`}>
            <ProductImage product={product} alt={title} width={190} height={190} size="190x190" />
          </Link>
        </ImageBox>

        {/* PRODUCT HOVER ACTION ICONS */}
        <HoverActions product={product} />
      </ImageWrapper>

      <ContentWrapper>
        {/* PRODUCT NAME / TITLE */}
        <ProductTitle title={title} slug={slug} />

        {/* PRODUCT RATING / REVIEW  */}
        <ProductRating rating={rating} my={0.5} />

        {/* PRODUCT PRICE WITH DISCOUNT */}
        <ProductPrice discount={discount} price={price} />
      </ContentWrapper>
    </StyledRoot>
  );
}
