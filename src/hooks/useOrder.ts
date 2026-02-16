"use client";

import { useState, useEffect } from "react";
import { OrderResource } from "@/types/order.types";
import { orderService } from "@/services/order.service";

export const useOrder = (code: string | null) => {
  const [order, setOrder] = useState<OrderResource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await orderService.getOrder(code);
        setOrder(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [code]);

  return { order, loading, error };
};
