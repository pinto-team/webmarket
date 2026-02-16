import Link from "next/link";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import { ProductImage } from "components/common/ProductImage";
// LOCAL CUSTOM COMPONENTS
import Discount from "./discount";
import HoverActions from "./hover-actions";
// STYLED COMPONENTS
import { ImageWrapper, ContentWrapper, StyledCard } from "./styles";
// CUSTOM DATA MODEL

// CUSTOM UTILS FUNCTION
import { currency } from "lib";

// ========================================================
interface Props {
  product: any;
  bgWhite?: boolean;
}
// ========================================================

export default function ProductCard17({ product, bgWhite = false }: Props) {
  const { slug, title, price, images, discount, categories } = product;

  return (
    <StyledCard elevation={0} bgWhite={bgWhite}>
      <ImageWrapper>
        <Discount discount={discount} />
        <HoverActions product={product} />

        <Link href={`/products/${slug}`} aria-label={`View ${title}`}>
          <ProductImage
            product={product}
            alt={title}
            width={750}
            height={750}
            size="750x750"
            className={images && images.length > 1 ? "thumbnail" : ""}
          />

          {images && images.length > 1 && (
            <ProductImage
              product={{ upload: images[1] }}
              alt={title}
              width={750}
              height={750}
              size="750x750"
              className="hover-thumbnail"
            />
          )}
        </Link>
      </ImageWrapper>

      <ContentWrapper>
        <Typography noWrap variant="body2" className="category">
          {categories.length > 0 ? categories[0] : "N/A"}
        </Typography>

        <Link href={`/products/${slug}`} aria-label={`View ${title}`}>
          <Typography noWrap variant="h5" className="title">
            {title}
          </Typography>
        </Link>

        <Typography variant="subtitle1" color="primary" fontWeight={600}>
          {currency(price)}
        </Typography>
      </ContentWrapper>
    </StyledCard>
  );
}
