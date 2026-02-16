"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export const useAddToCart = () => {
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addToCart: addToCartContext, refreshCart } = useCart();

  const addToCart = async (skuId: number, quantity: number = 1, productCode?: string) => {
    setLoading(true);
    try {
      await addToCartContext(skuId, quantity, productCode);
      await refreshCart();
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => setDialogOpen(false);

  return { addToCart, loading, dialogOpen, closeDialog };
};
