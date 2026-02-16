"use client";

import { useState } from "react";
import { orderService } from "@/services/order.service";
import { OrderCreateRequest, OrderResource } from "@/types/order.types";

export const useOrderCreate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const createOrder = async (data: OrderCreateRequest): Promise<OrderResource | null> => {
    setLoading(true);
    setError(null);

    try {
      const order = await orderService.createOrder(data);
      setOrderId(order.id);
      return order;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error, orderId };
};
