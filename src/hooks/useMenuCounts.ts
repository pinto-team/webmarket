import { useState, useEffect } from "react";
import { orderService } from "@/services/order.service";
import { getActiveTicket } from "@/services/ticket.service";
import { getNotifications } from "@/services/notification.service";

interface MenuCounts {
  orders: number;
  tickets: number;
  notifications: number;
}

export function useMenuCounts() {
  const [counts, setCounts] = useState<MenuCounts>({
    orders: 0,
    tickets: 0,
    notifications: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [ordersData, ticketData, notificationsData] = await Promise.allSettled([
          orderService.getOrders({ paged: 1, count: 1 }),
          getActiveTicket(),
          getNotifications({ paged: 1, count: 1 })
        ]);

        setCounts({
          orders: ordersData.status === "fulfilled" ? ordersData.value.pagination.total : 0,
          tickets: ticketData.status === "fulfilled" && ticketData.value ? 1 : 0,
          notifications: notificationsData.status === "fulfilled" 
            ? notificationsData.value.items.filter(n => n.status === 0).length 
            : 0
        });
      } catch (err) {}
    };

    fetchCounts();
  }, []);

  return counts;
}
