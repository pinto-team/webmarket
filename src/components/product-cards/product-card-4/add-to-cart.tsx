"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// MUI ICON COMPONENTS
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
// GLOBAL CUSTOM HOOKS
import { useCart } from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function AddToCart({ product }: Props) {
  const { id, title, price, thumbnail, slug } = product;

  const router = useRouter();

  const handleAddToCart = () => {
    // Product cards don't have SKU information
    // Redirect to product detail page to select variant and add to cart
    router.push(`/products/${slug}`, { scroll: false });
  };

  return (
    <Button
      color="primary"
      variant="outlined"
      onClick={handleAddToCart}
      sx={{ padding: "3px", alignSelf: "self-end" }}>
      <Add fontSize="small" />
    </Button>
  );
}
