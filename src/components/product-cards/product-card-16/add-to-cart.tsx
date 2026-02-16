"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// MUI
import Add from "@mui/icons-material/Add";
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      // TODO: Update to use actual SKU ID from product
      // await addToCart(product.skuId, 1);
      console.warn('Cart functionality needs SKU ID from product');
      router.push("/mini-cart", { scroll: false });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      color="primary"
      variant="outlined"
      loading={isLoading}
      onClick={handleAddToCart}
      sx={{ padding: "3px" }}>
      <Add fontSize="small" />
    </Button>
  );
}
