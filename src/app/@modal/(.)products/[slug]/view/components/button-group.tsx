"use client";

import { useState } from "react";
import Button from "@mui/material/Button";

import { useCart } from "hooks/useCart";
import IconLink from "components/icon-link";

import Product from "models/Product.model";

export default function ButtonGroup({ product }: { product: Product }) {
  const [isLoading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // TODO: Update to use actual SKU ID from product
      // await addToCart(product.skuId, 1);
      console.warn('Cart functionality needs SKU ID from product');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        disableElevation
        size="large"
        color="primary"
        variant="contained"
        loading={isLoading}
        onClick={handleAddToCart}>
        Add to Cart
      </Button>

      <IconLink title="View Product Details" url={`/products/${product.slug}`} sx={{ mt: 2 }} />
    </>
  );
}
