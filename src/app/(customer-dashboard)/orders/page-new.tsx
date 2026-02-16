"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Card, Typography, Chip, Button, Pagination, CircularProgress, Alert } from "@mui/material";
import { useOrdersList } from "@/hooks/useOrdersList";
import { OrderFilters } from "@/components/order";
import { formatPersianDate, formatPersianPrice } from "@/utils/persian";

export default function OrdersPageNew() {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const { orders, pagination, loading, error } = useOrdersList({ keyword, paged: page, count: 10 });
  
  const filteredOrders = status ? orders.filter(o => o.status.toString() === status) : orders;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const handleClear = () => {
    setKeyword("");
    setStatus("");
    setPage(1);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>My Orders</Typography>
      
      <OrderFilters
        keyword={keyword}
        status={status}
        onKeywordChange={setKeyword}
        onStatusChange={setStatus}
        onClear={handleClear}
      />

      {filteredOrders.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography>No orders found</Typography>
        </Card>
      ) : (
        <>
          {filteredOrders.map((order) => (
            <Card key={order.id} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{order.code}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPersianDate(order.created_at)}
                  </Typography>
                  <Chip label={order.status_label} size="small" sx={{ mt: 1 }} />
                </Box>
                <Box textAlign="right">
                  <Typography variant="h6">{formatPersianPrice(order.total_price)} تومان</Typography>
                  <Button
                    component={Link}
                    href={`/customer/orders/${order.code}`}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    View Details
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
          
          {pagination && pagination.last_page > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.last_page}
                page={page}
                onChange={(_, value) => setPage(value)}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
