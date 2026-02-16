"use client";

import { useState, useEffect } from "react";
import { OrderListParams, OrderResource } from "@/types/order.types";
import { orderService,  } from "@/services/order.service";

export const useOrders = (params?: OrderListParams) => {
  const [orders, setOrders] = useState<OrderResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await orderService.getOrders(params);
        setOrders(response.items);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [params?.keyword, params?.count, params?.paged, params]);

  return { orders, loading, error, pagination };
};
