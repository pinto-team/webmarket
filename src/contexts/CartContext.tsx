"use client";

import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useSnackbar } from "notistack";

import { cartService } from "@/services/cart.service";
import type { CartItemResource } from "@/types/product.types";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/i18n/t";

interface CartContextType {
    cart: CartItemResource[];
    loading: boolean;
    error: string | null;
    itemCount: number;
    subtotal: number;

    addToCart: (skuId: number, quantity?: number, productCode?: string) => Promise<void>;
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error(t("errors.general"));
    }
    return context;
};

export default function CartProvider({ children }: PropsWithChildren) {
    const [cart, setCart] = useState<CartItemResource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { isAuthenticated } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const itemCount = useMemo(
        () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
        [cart]
    );

    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + (item.sku?.price || 0) * (item.quantity || 0), 0),
        [cart]
    );

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await cartService.getCartItems();
            setCart(response.data || []);
        } catch (err: any) {
            const message = err?.response?.data?.message || t("errors.serverError");
            setError(message);
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (skuId: number, quantity: number = 1, productCode?: string) => {
        try {
            setError(null);

            await cartService.addToCart({ sku_id: skuId, quantity, product_code: productCode });
            await fetchCart();

            enqueueSnackbar(t("messages.addedToCart"), { variant: "success" });
        } catch (err: any) {
            const message = err?.response?.data?.message || t("errors.serverError");
            setError(message);
            enqueueSnackbar(message, { variant: "error" });
            throw err;
        }
    };

    const updateQuantity = async (id: number, quantity: number) => {
        try {
            setError(null);

            if (quantity < 1) {
                await removeItem(id);
                return;
            }

            await cartService.updateCartItem(id, quantity);
            await fetchCart();
        } catch (err: any) {
            const message = err?.response?.data?.message || t("errors.serverError");
            setError(message);
            enqueueSnackbar(message, { variant: "error" });
            throw err;
        }
    };

    const removeItem = async (id: number) => {
        try {
            setError(null);

            await cartService.removeCartItem(id);
            await fetchCart();

            enqueueSnackbar(t("messages.removedFromCart"), { variant: "info" });
        } catch (err: any) {
            const message = err?.response?.data?.message || t("errors.serverError");
            setError(message);
            enqueueSnackbar(message, { variant: "error" });
            throw err;
        }
    };

    const clearCart = async () => {
        try {
            setError(null);

            await cartService.clearCart();
            await fetchCart();

            enqueueSnackbar(t("messages.cartCleared"), { variant: "success" });
        } catch (err: any) {
            const message = err?.response?.data?.message || t("errors.serverError");
            setError(message);
            enqueueSnackbar(message, { variant: "error" });
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        cartService.syncCart(true).then(() => fetchCart());
    }, [isAuthenticated]);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                itemCount,
                subtotal,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
                refreshCart: fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
