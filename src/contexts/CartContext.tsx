"use client";

import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    useCallback,
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

    // cart ops
    addToCart: (skuId: number, quantity?: number, productCode?: string) => Promise<void>;
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    removeItem: (id: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;

    // ✅ UI state for MiniCart (instant open, no navigation)
    isMiniCartOpen: boolean;
    openMiniCart: () => void;
    closeMiniCart: () => void;
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

    // ✅ mini-cart UI state
    const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

    const { isAuthenticated } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    // Avoid duplicate sync/fetch on rapid auth state flips
    const didInitialSyncRef = useRef(false);

    const itemCount = useMemo(
        () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
        [cart]
    );

    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + (item.sku?.price || 0) * (item.quantity || 0), 0),
        [cart]
    );

    const fetchCart = useCallback(async () => {
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
    }, []);

    const addToCart = useCallback(
        async (skuId: number, quantity: number = 1, productCode?: string) => {
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
        },
        [enqueueSnackbar, fetchCart]
    );

    const updateQuantity = useCallback(
        async (id: number, quantity: number) => {
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
        },
        [enqueueSnackbar, fetchCart] // removeItem comes from below but is stable via useCallback (defined next)
    );

    const removeItem = useCallback(
        async (id: number) => {
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
        },
        [enqueueSnackbar, fetchCart]
    );

    const clearCart = useCallback(async () => {
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
    }, [enqueueSnackbar, fetchCart]);

    // ✅ UI controls (stable refs)
    const openMiniCart = useCallback(() => setIsMiniCartOpen(true), []);
    const closeMiniCart = useCallback(() => setIsMiniCartOpen(false), []);

    // Clear cart client-side when user is unauthenticated
    useEffect(() => {
        if (!isAuthenticated) {
            setCart([]);
            setError(null);
            cartService.clearTempId();

            // Also close drawer to avoid stale UI
            setIsMiniCartOpen(false);

            // Reset sync guard
            didInitialSyncRef.current = false;
        }
    }, [isAuthenticated]);

    // Initial sync + fetch on auth
    useEffect(() => {
        if (!isAuthenticated) return;
        if (didInitialSyncRef.current) return;

        didInitialSyncRef.current = true;

        cartService
            .syncCart(true)
            .then(() => fetchCart())
            .catch(() => {
                // If sync fails, still try fetching to keep UI usable
                void fetchCart();
            });
    }, [isAuthenticated, fetchCart]);

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

                isMiniCartOpen,
                openMiniCart,
                closeMiniCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}