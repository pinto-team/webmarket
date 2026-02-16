"use client";

import { useState, useMemo } from "react";
// MUI
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// GLOBAL CUSTOM HOOKS
import { useCart } from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";
import { toPersianNumber } from "@/utils/persian";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function AddToCartButton({ product }: Props) {
  const { cart, addToCart, updateQuantity, removeItem } = useCart();
  const [isLoading, setLoading] = useState(false);

  // Find cart item for this product
  const cartItem = useMemo(() => {
    return cart.find(item => item.product?.code === product.id);
  }, [cart, product.id]);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // Use first SKU if available, otherwise use product id as fallback
      const skuId = 1; // Temporary fallback
      await addToCart(skuId, 1, product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async () => {
    if (!cartItem) return;
    setLoading(true);
    try {
      await updateQuantity(cartItem.id, cartItem.quantity + 1);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async () => {
    if (!cartItem) return;
    setLoading(true);
    try {
      if (cartItem.quantity === 1) {
        await removeItem(cartItem.id);
      } else {
        await updateQuantity(cartItem.id, cartItem.quantity - 1);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show quantity controls if item is in cart
  if (cartItem) {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <IconButton
          size="small"
          color="primary"
          disabled={isLoading}
          onClick={handleDecrease}
          sx={{ padding: 0.5 }}
        >
          <Remove fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: 24, textAlign: "center" }}>
          {toPersianNumber(cartItem.quantity)}
        </Typography>
        <IconButton
          size="small"
          color="primary"
          disabled={isLoading}
          onClick={handleIncrease}
          sx={{ padding: 0.5 }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  // Show add button if item is not in cart
  return (
    <Button
      color="primary"
      disabled={isLoading}
      variant="contained"
      sx={{ padding: 0.5, minHeight: 0 }}
      onClick={handleAddToCart}>
      <Add fontSize="small" />
    </Button>
  );
}
