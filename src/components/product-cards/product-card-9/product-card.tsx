import Link from "next/link";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import { ProductImage } from "components/common/ProductImage";
// LOCAL CUSTOM COMPONENTS
import DiscountChip from "../discount-chip";
import ProductPrice from "../product-price";
import ProductTags from "./components/tags";
import FavoriteButton from "./components/favorite-button";
// CUSTOM DATA MODEL

// STYLED COMPONENT
import { ContentWrapper, Wrapper } from "./styles";

// ===========================================================
type Props = { product: any };
// ===========================================================

export default function ProductCard9({ product }: Props) {
  const { title, price, discount, rating, slug } = product;

  return (
    <Wrapper>
      {/* PRODUCT FAVORITE BUTTON */}
      <FavoriteButton />

      <ContentWrapper>
        <div className="img-wrapper">
          {/* DISCOUNT PERCENT CHIP IF AVAILABLE */}
          <DiscountChip discount={discount} />

          {/* PRODUCT IMAGE / THUMBNAIL */}
          <ProductImage product={product} alt={title} width={500} height={500} size="500x500" />
        </div>

        <div className="content">
          <div>
            {/* PRODUCT TAG LIST */}
            <ProductTags tags={["Bike", "Motor", "Ducati"]} />

            {/* PRODUCT TITLE / NAME */}
            <Link href={`/products/${slug}`}>
              <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>
                {title}
              </Typography>
            </Link>

            {/* PRODUCT RATING / REVIEW  */}
            <Rating size="small" value={rating} color="warn" readOnly />

            {/* PRODUCT PRICE */}
            <ProductPrice price={price} discount={discount} />
          </div>
        </div>
      </ContentWrapper>
    </Wrapper>
  );
}
