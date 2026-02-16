import Link from "next/link";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
// GLOBAL CUSTOM COMPONENTS
import { ProductImage } from "components/common/ProductImage";
// LOCAL CUSTOM COMPONENTS
import ProductPrice from "../product-price";
import ProductTitle from "../product-title";
import DiscountChip from "../discount-chip";
import FavoriteButton from "./favorite-button";
// STYLED COMPONENTS
import { ImageWrapper, ContentWrapper, StyledCard, HoverIconWrapper } from "./styles";

// ========================================================
interface Props {
  product: any;
  showRating?: boolean;
  showProductSize?: boolean;
}
// ========================================================

export default function ProductCard1({ product, showProductSize, showRating = true }: Props) {
  const slug = product.slug || product.code;
  const title = product.title;
  const price = product.price || product.skus?.[0]?.price || 0;
  const rating = product.rating || 0;
  const discount = product.discount || product.skus?.[0]?.discount || 0;

  return (
    <StyledCard>
      <ImageWrapper>
        {/* DISCOUNT PERCENT CHIP IF AVAILABLE */}
        <DiscountChip discount={discount} />

        {/* HOVER ACTION ICONS */}
        <HoverIconWrapper className="hover-box">
          <Link href={`/products/${slug}/view`} scroll={false}>
            <IconButton color="inherit">
              <RemoveRedEye fontSize="small" color="inherit" />
            </IconButton>
          </Link>

          <FavoriteButton />
        </HoverIconWrapper>

        {/* PRODUCT IMAGE / THUMBNAIL */}
        <Link href={`/products/${slug}`}>
          <ProductImage
            product={product}
            alt={title}
            width={300}
            height={300}
            size="300x300"
            className="thumbnail"
          />
        </Link>
      </ImageWrapper>

      <ContentWrapper>
        <div className="content">
          {/* PRODUCT NAME / TITLE */}
          <ProductTitle title={title} slug={slug} />

          {/* PRODUCT RATINGS IF AVAILABLE */}
          {showRating && <Rating size="small" value={rating} color="warn" readOnly />}

          {/* PRODUCT SIZE IF AVAILABLE */}
          {showProductSize ? <p className="size">Liter</p> : null}

          {/* PRODUCT PRICE WITH DISCOUNT */}
          <ProductPrice discount={discount} price={price} />
        </div>
      </ContentWrapper>
    </StyledCard>
  );
}
