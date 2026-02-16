"use client";

import { Fragment, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import OrderSummery from "../order-summery";
import OrderProgress from "../order-progress";
import OrderedProducts from "../ordered-products";
import DashboardHeader from "../../dashboard-header";
import { orderService } from "@/services/order.service";
import type { OrderResource } from "@/types/order.types";

type Props = { orderId: string };

export function OrderDetailsPageView({ orderId }: Props) {
  const [order, setOrder] = useState<OrderResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const result = await orderService.getOrder(orderId);
        setOrder(result);
      } catch (err: any) {
        setError(err.response?.data?.message || "خطا در دریافت جزئیات سفارش");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Fragment>
        <DashboardHeader href="/orders" title="جزئیات سفارش" />
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </Fragment>
    );
  }

  if (error || !order) {
    return (
      <Fragment>
        <DashboardHeader href="/orders" title="جزئیات سفارش" />
        <Box py={4} textAlign="center">
          <Typography color="error">{error || "سفارش یافت نشد"}</Typography>
        </Box>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <DashboardHeader href="/orders" title="جزئیات سفارش" />

      <OrderProgress order={order} />

      <OrderedProducts order={order} />

      <OrderSummery order={order} />
    </Fragment>
  );
}
