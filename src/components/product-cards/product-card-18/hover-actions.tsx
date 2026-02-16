"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
// GLOBAL CUSTOM HOOK
import { useCart } from "@/contexts/CartContext";
// STYLED COMPONENTS
import { HoverButtonsWrapper } from "./styles";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ========================================================
interface Props {
  product: Product;
}
// ========================================================

export default function HoverActions({ product }: Props) {
  const { id, slug, title, price, thumbnail } = product;

  const [isLoading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(async () => {
    setLoading(true);
    try {
      // Note: This component uses old Product model with string id
      // For now, we'll convert to number. In future, should use proper SKU ID
      const skuId = parseInt(id);
      if (isNaN(skuId)) {
        console.warn('Invalid product ID for cart:', id);
        return;
      }
      await addToCart(skuId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  }, [addToCart, id]);

  return (
    <HoverButtonsWrapper className="hover-buttons">
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

      <Link scroll={false} href={`/products/${slug}/view`}>
        <Button disableElevation color="primary" variant="contained" aria-label="Quick view">
          <SvgIcon width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
            />
          </SvgIcon>
        </Button>
      </Link>
    </HoverButtonsWrapper>
  );
}
