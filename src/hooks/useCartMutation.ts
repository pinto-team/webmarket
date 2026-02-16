import { useState } from "react";
import { useCart } from "./useCart";

export const useCartMutation = () => {
  const { addToCart, updateQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = async (skuId: number, quantity: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      await addToCart(skuId, quantity);
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطا در افزودن به سبد خرید");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: number, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      await updateQuantity(id, quantity);
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطا در بروزرسانی سبد خرید");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await removeItem(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "خطا در حذف از سبد خرید");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addItem,
    updateItem,
    deleteItem,
    loading,
    error
  };
};
