import Link from "next/link";
import Rating from "@mui/material/Rating";
// CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import HoverActions from "./hover-actions";
// STYLED COMPONENTS
import { Card, CardMedia, CardContent } from "./styles";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
import ProductImage from "@/components/common/ProductImage";
import { toPersianNumber } from "@/utils/persian";
// CUSTOM DATA MODEL


// ==============================================================
type Props = { product: any };
// ==============================================================

export default function ProductCard10({ product }: Props) {
  const { slug, price, rating, title, reviews } = product;

  return (
    <Card>
      <CardMedia>
        <Link href={`/products/${slug}`} aria-label={`View details for ${title}`}>
          <ProductImage
            product={product}
            width={300}
            height={300}
            size="300x300"
            alt={title}
            className="product-img"
          />
        </Link>

        <HoverActions slug={slug} />
      </CardMedia>

      <CardContent>
        <p className="title">{title}</p>
        <p className="price">{currency(price)}</p>

        <div className="ratings">
          <Rating name="read-only" value={rating || 4} readOnly />
          <p className="amount">({toPersianNumber(reviews?.length || 0)})</p>
        </div>

        <AddToCart product={product} />
      </CardContent>
    </Card>
  );
}
