"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Card, Typography, Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { orderService } from "@/services/order.service";
import { OrderResource } from "@/types/order.types";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [order, setOrder] = useState<OrderResource | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      const orderId = searchParams.get("order_id") || searchParams.get("orderId");
      const orderCode = searchParams.get("order_code") || searchParams.get("orderCode");
      const success = searchParams.get("success");
      
      if (!orderId && !orderCode) {
        setStatus("failed");
        return;
      }

      try {
        // Fetch final order status from API
        const orderData = await orderService.getOrder(orderId || orderCode || '');
        setOrder(orderData);
        
        // Determine status based on order status or success param
        if (success === "true" || orderData.status === 1) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setStatus("failed");
      }
    };

    fetchOrderStatus();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" p={2}>
      <Card sx={{ p: 4, maxWidth: 500, textAlign: "center" }}>
        {status === "success" ? (
          <>
            <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>پرداخت موفق</Typography>
            <Typography variant="body1" color="text.secondary" mb={1}>
              سفارش شما با موفقیت ثبت شد.
            </Typography>
            {order && (
              <Typography variant="body2" color="text.secondary" mb={3}>
                کد سفارش: {order.code}
              </Typography>
            )}
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push(order ? `/customer/orders` : '/')}
            >
              مشاهده سفارشات
            </Button>
          </>
        ) : (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>پرداخت ناموفق</Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              پرداخت شما با مشکل مواجه شد. لطفا دوباره تلاش کنید.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/cart")}
            >
              بازگشت به سبد خرید
            </Button>
          </>
        )}
      </Card>
    </Box>
  );
}
