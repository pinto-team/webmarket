import { useState, useEffect } from "react";
import { orderService } from "@/services/order.service";
import { t } from "@/i18n/t";

export interface OrderStats {
    total: number;
    awaitingDelivery: number;
    awaitingShipment: number;
    awaitingPayment: number;
}

export const useOrderStats = () => {
    const [stats, setStats] = useState<OrderStats>({
        total: 0,
        awaitingDelivery: 0,
        awaitingShipment: 0,
        awaitingPayment: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { items, pagination } = await orderService.getOrders({
                    count: 1000,
                    paged: 1,
                });

                const awaitingPayment = items.filter((o) => o.status === 0).length;
                const awaitingShipment = items.filter((o) => o.status === 1).length;
                const awaitingDelivery = items.filter((o) => o.status === 2).length;

                setStats({
                    total: pagination.total,
                    awaitingDelivery,
                    awaitingShipment,
                    awaitingPayment,
                });
            } catch (err: any) {
                if (err?.response?.status === 404) {
                    setStats({
                        total: 0,
                        awaitingDelivery: 0,
                        awaitingShipment: 0,
                        awaitingPayment: 0,
                    });
                } else {
                    setError(t("errors.serverError"));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, loading, error };
};
