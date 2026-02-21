import Link from "next/link";
import Rating from "@mui/material/Rating";
// GLOBAL CUSTOM COMPONENTS
import ProductImage from "@/components/common/ProductImage";
// LOCAL CUSTOM COMPONENTS
import HoverActions from "./hover-actions";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
import { toPersianNumber } from "@/utils/persian";
// STYLED COMPONENTS
import { Card, CardMedia, CardContent } from "./styles";
// CUSTOM DATA MODEL


// ==============================================================
type Props = { product: any };
// ==============================================================

export default function ProductCard8({ product }: Props) {
  const { slug, title, price, categories, reviews, rating } = product;

  return (
    <Card>
      <CardMedia>
        <Link href={`/products/${slug}`}>
          <ProductImage
            product={product}
            width={300}
            height={300}
            size="300x300"
            alt={title}
            className="product-img"
          />
        </Link>

        <HoverActions product={product} />
      </CardMedia>

      <CardContent>
        {/* PRODUCT CATEGORY */}
        {categories.length > 0 ? <p className="category">{categories[0]}</p> : null}

        {/* PRODUCT TITLE / NAME */}
        <p className="title">{title}</p>

        {/* PRODUCT PRICE */}
        <h4 className="price">{currency(price)}</h4>

        {/* PRODUCT RATING / REVIEW */}
        <div className="ratings">
          <Rating readOnly value={rating} sx={{ fontSize: 16 }} />
          <p className="total">({toPersianNumber(reviews?.length || 0)} Reviews)</p>
        </div>
      </CardContent>
    </Card>
  );
}
