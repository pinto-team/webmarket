"use client";

import { useState } from "react";
import { orderService } from "@/services/order.service";
import { OrderUpdateRequest, PaymentInitiationResponse } from "@/types/order.types";

export const useOrderUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentInitiationResponse | null>(null);

  const updateOrder = async (code: string | number, data: OrderUpdateRequest): Promise<PaymentInitiationResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const orderId = typeof code === 'string' ? parseInt(code) : code;
      const response = await orderService.requestPaymentGateway(orderId, data);
      setPaymentData(response);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateOrder, loading, error, paymentData };
};
