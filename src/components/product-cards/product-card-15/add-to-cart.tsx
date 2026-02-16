"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// MUI
import Button from "@mui/material/Button";
// LOCAL CUSTOM HOOKS
import { useCart } from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function AddToCart({ product }: Props) {
  const { id, slug, title, thumbnail, price } = product;

  const { addToCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCart = async () => {
    setIsLoading(true);
    try {
      // TODO: Use proper SKU ID from product.skus[0].id instead of converting string id
      await addToCart(parseInt(id), 1);
      router.push("/mini-cart", { scroll: false });
    } catch (error) {
      // Error is handled by the cart context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      fullWidth
      color="primary"
      disableElevation
      variant="contained"
      loading={isLoading}
      onClick={handleCart}>
      Add To Cart
    </Button>
  );
}
