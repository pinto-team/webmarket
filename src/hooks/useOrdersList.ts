"use client";

import { useState, useEffect, useCallback } from "react";
import { orderService } from "@/services/order.service";
import { OrderResource, OrderListParams } from "@/types/order.types";
import { PaginatedResponse } from "@/types/api.types";

export const useOrdersList = (params?: OrderListParams) => {
  const [orders, setOrders] = useState<OrderResource[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
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
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, pagination, loading, error, refetch: fetchOrders };
};
