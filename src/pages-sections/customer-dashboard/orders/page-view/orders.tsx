"use client";

import { Fragment, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Packages from "icons/Packages";
import OrderRow from "../order-row";
import Pagination from "../../pagination";
import DashboardHeader from "../../dashboard-header";
import { orderService, type OrderCollection } from "@/services/order.service";

export function OrdersPageView() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  
  const [data, setData] = useState<OrderCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const result = await orderService.getOrders({ paged: page, count: 10 });
        setData(result);
      } catch (err: any) {
        setError(err.response?.data?.message || "خطا در دریافت سفارشات");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  if (loading) {
    return (
      <Fragment>
        <DashboardHeader Icon={Packages} title="سفارشات من" />
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </Fragment>
    );
  }

  if (error) {
    return (
      <Fragment>
        <DashboardHeader Icon={Packages} title="سفارشات من" />
        <Box py={4} textAlign="center">
          <Typography color="error">{error}</Typography>
        </Box>
      </Fragment>
    );
  }

  if (!data || !data.items || data.items.length === 0) {
    return (
      <Fragment>
        <DashboardHeader Icon={Packages} title="سفارشات من" />
        <Box py={8} textAlign="center">
          <Packages sx={{ fontSize: 80, color: "grey.300", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            سفارشی ثبت نشده است
          </Typography>
          <Typography variant="body2" color="text.disabled">
            هنوز هیچ سفارشی ثبت نکرده‌اید
          </Typography>
        </Box>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <DashboardHeader Icon={Packages} title="سفارشات من" />

      {data.items.map((order) => (
        <OrderRow order={order} key={order.id} />
      ))}

      {data.pagination.last_page > 1 && <Pagination count={data.pagination.last_page} />}
    </Fragment>
  );
}
