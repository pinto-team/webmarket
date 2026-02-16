import { useState, useEffect } from "react";
import { orderService } from "@/services/order.service";

export interface OrderStats {
  total: number;
  awaitingDelivery: number;
  awaitingShipment: number;
  awaitingPayment: number;
}

export const useOrderStats = () => {
  const [stats, setStats] = useState<OrderStats>({ total: 0, awaitingDelivery: 0, awaitingShipment: 0, awaitingPayment: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all orders to get accurate counts
        const { items, pagination } = await orderService.getOrders({ count: 1000, paged: 1 });
        
        // Count orders by status
        const awaitingPayment = items.filter(o => o.status === 0 || o.status_label?.includes('پرداخت')).length;
        const awaitingShipment = items.filter(o => o.status === 1 || o.status_label?.includes('ارسال')).length;
        const awaitingDelivery = items.filter(o => o.status === 2 || o.status_label?.includes('تحویل')).length;

        setStats({
          total: pagination.total,
          awaitingDelivery,
          awaitingShipment,
          awaitingPayment
        });
      } catch (err: any) {
        if (err.response?.status === 404) {
          // No orders found
          setStats({ total: 0, awaitingDelivery: 0, awaitingShipment: 0, awaitingPayment: 0 });
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
