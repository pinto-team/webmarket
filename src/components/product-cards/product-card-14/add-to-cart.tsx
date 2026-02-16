"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "hooks/useCart";
import Product from "models/Product.model";
// STYLED COMPONENTS
import { StyledButton } from "./styles";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function AddToCart({ product }: Props) {
  const { id, slug, title, thumbnail, price } = product;

  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleCart = async () => {
    setIsLoading(true);

    try {
      // For now, using a placeholder SKU ID since this component uses legacy Product model
      // This should be updated to use proper ProductResource with SKU information
      const skuId = parseInt(id) || 1;
      await addToCart(skuId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href="/mini-cart" scroll={false}>
      <StyledButton
        fullWidth
        disableElevation
        color="primary"
        loading={isLoading}
        onClick={handleCart}
        className="add-to-cart">
        Add To Cart
      </StyledButton>
    </Link>
  );
}
