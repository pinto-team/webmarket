import Link from "next/link";
// MUI
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM COMPONENTS
import { ProductImage } from "components/common/ProductImage";
// LOCAL CUSTOM COMPONENTS
import ProductPrice from "../product-price";
// CUSTOM DATA MODEL


// ========================================================
interface Props {
  product: any;
  showReview?: boolean;
}
// ========================================================

export default function ProductCard2({ product, showReview = true }: Props) {
  const { slug, title, price, rating, discount } = product;

  return (
    <div>
      <Link href={`/products/${slug}`}>
        <Box
          sx={{
            borderRadius: 3,
            position: "relative",
            backgroundColor: "grey.50",
            height: 370,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}>
          <ProductImage
            product={product}
            alt={title}
            width={370}
            height={370}
            size="370x370"
            style={{ objectFit: "cover", objectPosition: "center", width: "100%", height: "100%" }}
          />
        </Box>
      </Link>

      <Box mt={2}>
        <Typography noWrap variant="h6" sx={{ mb: 0.5 }}>
          {title}
        </Typography>

        {showReview && <Rating size="small" value={rating} color="warn" readOnly />}

        <ProductPrice price={price} discount={discount} />
      </Box>
    </div>
  );
}
