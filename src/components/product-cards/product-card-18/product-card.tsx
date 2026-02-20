import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// CUSTOM COMPONENTS
import Discount from "./discount";
import HoverActions from "./hover-actions";
import ImageCarousel from "./image-carousel";
import { FlexBox } from "components/flex-box";
import ProductImage from "@/components/common/ProductImage";
// STYLED COMPONENTS
import { ImageWrapper, ContentWrapper, StyledRoot } from "./styles";
// CUSTOM DATA MODEL

// CUSTOM UTILS FUNCTION
import { calculateDiscount, currency } from "lib";

// ========================================================
interface Props {
  product: any;
}
// ========================================================

export default function ProductCard18({ product }: Props) {
  const { slug, title, price, images, discount } = product;

  const hasDiscount = discount > 0;

  return (
    <Link href={`/products/${slug}`} aria-label={`View - ${title}`}>
      <StyledRoot>
        <ImageWrapper>
          {hasDiscount && <Discount discount={discount} />}

          <HoverActions product={product} />

          {images && images.length > 1 ? (
            <ImageCarousel>
              {images.map((image: any, i: number) => (
                <ProductImage
                  key={i}
                  product={{ upload: image }}
                  alt={title}
                  width={375}
                  height={375}
                  size="375x375"
                  className="thumbnail"
                />
              ))}
            </ImageCarousel>
          ) : (
            <ProductImage
              product={product}
              alt={title}
              width={500}
              height={500}
              size="500x500"
              className="thumbnail"
            />
          )}
        </ImageWrapper>

        <ContentWrapper>
          <Typography noWrap variant="body2" className="category">
            Earphones
          </Typography>

          <Link href={`/products/${slug}`} aria-label={`View ${title}`}>
            <Typography noWrap variant="h5" className="title">
              {title}
            </Typography>
          </Link>

          <FlexBox alignItems="center" justifyContent="center" gap={1}>
            <Typography variant="subtitle1" color="primary" fontWeight={600}>
              {calculateDiscount(price, discount)}
            </Typography>

            {hasDiscount && (
              <Box component="del" fontSize={14} fontWeight={500} color="text.secondary">
                {currency(price)}
              </Box>
            )}
          </FlexBox>
        </ContentWrapper>
      </StyledRoot>
    </Link>
  );
}
