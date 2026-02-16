"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import Button from "@mui/material/Button";
// GLOBAL CUSTOM HOOK
import { useCart } from "hooks/useCart";
// STYLED COMPONENTS
import { HoverWrapper } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ========================================================
interface Props {
  product: Product;
}
// ========================================================

export default function HoverActions({ product }: Props) {
  const { slug } = product;
  const { addToCart } = useCart();
  const [isCartLoading, setCartLoading] = useState(false);
  const [isQuickViewLoading, setQuickViewLoading] = useState(false);

  const handleAddToCart = useCallback(async () => {
    setCartLoading(true);
    try {
      // TODO: Update to use actual SKU ID from product
      // await addToCart(product.skuId, 1);
      console.warn('Cart functionality needs SKU ID from product');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setCartLoading(false);
    }
  }, []);

  const handleQuickView = useCallback(() => {
    setQuickViewLoading(true);
  }, []);

  const handleNavigate = useCallback(() => {
    setQuickViewLoading(false);
  }, []);

  return (
    <HoverWrapper className="hover-box">
      <Link scroll={false} href="/mini-cart">
        <Button
          fullWidth
          color="primary"
          variant="contained"
          loading={isCartLoading}
          onClick={handleAddToCart}
          aria-label="Add to cart">
          Add to cart
        </Button>
      </Link>

      <Link scroll={false} href={`/products/${slug}/view`} onNavigate={handleNavigate}>
        <Button
          fullWidth
          disableElevation
          color="inherit"
          variant="contained"
          className="view-btn"
          onClick={handleQuickView}
          loading={isQuickViewLoading}
          aria-label="Quick view">
          Quick View
        </Button>
      </Link>
    </HoverWrapper>
  );
}
