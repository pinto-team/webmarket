"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Box, Card, Typography, Chip, Divider, Stack, TextField, Button, CircularProgress, Alert } from "@mui/material";
import { useOrder } from "@/hooks/useOrder";
import { useOrderNote } from "@/hooks/useOrderNote";
import { OrderPrintButton } from "@/components/order";
import { formatPersianDate, formatPersianPrice, toPersianNumber } from "@/utils/persian";

export default function OrderDetailsPageNew() {
  const params = useParams();
  const code = params.code as string;
  const { order, loading, error } = useOrder(code);
  const { createNote, loading: noteLoading } = useOrderNote();
  const [noteText, setNoteText] = useState("");

  const handleAddNote = async () => {
    if (!order || !noteText.trim()) return;
    
    const result = await createNote({
      order_id: order.id,
      description: noteText,
      type: 1
    });
    
    if (result) {
      setNoteText("");
      alert("Note added successfully");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return <Alert severity="error">{error || "Order not found"}</Alert>;
  }

  return (
    <Box>
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Order {order.code}</Typography>
          <Stack direction="row" spacing={1}>
            <OrderPrintButton order={order} />
            <Chip label={order.status_label} />
          </Stack>
        </Stack>
        
        <Typography variant="body2" color="text.secondary">
          {formatPersianDate(order.created_at)}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Customer:</Typography>
            <Typography fontWeight={600}>{order.customer_name}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Mobile:</Typography>
            <Typography fontWeight={600}>{order.customer_mobile}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Total:</Typography>
            <Typography fontWeight={700} color="primary">{formatPersianPrice(order.total_price)} تومان</Typography>
          </Stack>
        </Stack>
      </Card>

      {order.shipments.map((shipment) => (
        <Card key={shipment.id} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>{shipment.shop.title}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {shipment.code} - {shipment.status_label}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {shipment.items.map((item) => (
            <Stack key={item.id} direction="row" justifyContent="space-between" mb={1}>
              <Typography>{item.sku.title} × {toPersianNumber(item.quantity)}</Typography>
              <Typography fontWeight={600}>{formatPersianPrice(item.price)} تومان</Typography>
            </Stack>
          ))}
        </Card>
      ))}

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Add Note</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add a note to this order..."
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleAddNote}
          disabled={noteLoading || !noteText.trim()}
        >
          {noteLoading ? <CircularProgress size={24} /> : "Add Note"}
        </Button>
      </Card>
    </Box>
  );
}
