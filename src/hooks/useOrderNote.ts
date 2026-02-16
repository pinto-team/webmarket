"use client";

import { useState } from "react";
import { orderService } from "@/services/order.service";
import { OrderNoteCreateRequest } from "@/types/order.types";

export const useOrderNote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNote = async (data: OrderNoteCreateRequest): Promise<number | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await orderService.createOrderNote(data);
      return result.id;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create note");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createNote, loading, error };
};
