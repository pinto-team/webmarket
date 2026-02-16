"use client";

import { useState } from "react";
import { orderService } from "@/services/order.service";
import { OrderCreateRequest, OrderCreateResponse } from "@/types/order.types";
import { useCart } from "@/contexts/CartContext";

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  const checkout = async (data: OrderCreateRequest): Promise<OrderCreateResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const order = await orderService.createOrder(data);
      await clearCart();
      return order;
    } catch (err: any) {
      setError(err.response?.data?.message || "Checkout failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading, error };
};
