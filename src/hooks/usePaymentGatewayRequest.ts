"use client";

import { useState } from "react";
import { orderService } from "@/services/order.service";
import { OrderUpdateRequest, PaymentInitiationResponse } from "@/types/order.types";

export const usePaymentGatewayRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentInitiationResponse | null>(null);

  const requestPaymentGateway = async (
    orderId: number,
    data: OrderUpdateRequest
  ): Promise<PaymentInitiationResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await orderService.requestPaymentGateway(orderId, data);
      setPaymentData(response);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to request payment gateway");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { requestPaymentGateway, loading, error, paymentData };
};
