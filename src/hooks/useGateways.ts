import { useState, useEffect } from 'react';
import { GatewayResource } from '@/types/gateway.types';
import { getGateways } from '@/services/gateway.service';

export const useGateways = () => {
  const [gateways, setGateways] = useState<GatewayResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        setLoading(true);
        const data = await getGateways();
        setGateways(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'خطا در دریافت درگاه‌های پرداخت');
      } finally {
        setLoading(false);
      }
    };

    fetchGateways();
  }, []);

  return { gateways, loading, error };
};
