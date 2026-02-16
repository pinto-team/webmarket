"use client";

import { useState, useMemo } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
// GLOBAL CUSTOM HOOKS
import { useCart } from "hooks/useCart";
// CUSTOM DATA MODEL
import Product from "models/Product.model";
import { toPersianNumber } from "@/utils/persian";

// ==============================================================
type Props = { product: Product };
// ==============================================================

export default function AddToCart({ product }: Props) {
  const { cart, addToCart, updateQuantity, removeItem } = useCart();
  const [isLoading, setLoading] = useState(false);

  const cartItem = useMemo(() => {
    return cart.find(item => item.product?.code === product.id);
  }, [cart, product.id]);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const skuId = 1;
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

  if (cartItem) {
    return (
      <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
        <IconButton
          size="small"
          color="primary"
          disabled={isLoading}
          onClick={handleDecrease}
          sx={{ padding: "4px", minWidth: "auto" }}
        >
          <Remove fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ minWidth: 20, textAlign: "center" }}>
          {toPersianNumber(cartItem.quantity)}
        </Typography>
        <IconButton
          size="small"
          color="primary"
          disabled={isLoading}
          onClick={handleIncrease}
          sx={{ padding: "4px", minWidth: "auto" }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  return (
    <Button
      color="primary"
      variant="outlined"
      disabled={isLoading}
      onClick={handleAddToCart}
      sx={{ padding: "4px 8px", minWidth: "auto", flexShrink: 0 }}>
      <Add fontSize="small" />
    </Button>
  );
}
