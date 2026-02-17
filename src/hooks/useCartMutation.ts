import { useState } from "react";
import { useCart } from "./useCart";
import { t } from "@/i18n/t";

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
            setError(
                err?.response?.data?.message ||
                t("cart.errors.addFailed")
            );
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
            setError(
                err?.response?.data?.message ||
                t("cart.errors.updateFailed")
            );
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
            setError(
                err?.response?.data?.message ||
                t("cart.errors.deleteFailed")
            );
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
        error,
    };
};
