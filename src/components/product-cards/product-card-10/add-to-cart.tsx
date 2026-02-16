"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM HOOKS
import { useCart } from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function AddToCart({ product }: Props) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = useCallback(async () => {
    setIsLoading(true);
    try {
      // Note: This component uses mock Product model without skuId
      // In production, you need to pass actual skuId from ProductResource
      const skuId = parseInt(product.id) || 0;
      await addToCart(skuId, 1);
    } catch (error) {
      // Error handled by CartContext
    } finally {
      setIsLoading(false);
    }
  }, [addToCart, product.id]);

  return (
    <Link scroll={false} href="/mini-cart" className="add-to-cart-btn">
      <Button
        fullWidth
        color="primary"
        variant="contained"
        loading={isLoading}
        onClick={handleAddToCart}
        aria-label="Add to cart">
        Add to cart
      </Button>
    </Link>
  );
}
