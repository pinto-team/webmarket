"use client";

import Grid from "@mui/material/Grid";

import { useCart } from "@/contexts/CartContext";
import { t } from "@/i18n/t";
import { formatPersianNumber } from "@/utils/persian";

import Trash from "icons/Trash";
import CartItem from "../cart-item";
import EmptyCart from "../empty-cart";
import CheckoutForm from "../checkout-form";
import { CartHeader, CartHeaderTitle, ClearAllButton } from "../styles";

export default function CartPageView() {
    const { cart, clearCart } = useCart();

    if (!cart?.length) {
        return <EmptyCart />;
    }

    const countText = `${formatPersianNumber(cart.length)} ${t("cart.items")}`;

    return (
        <>
            <CartHeader>
                <CartHeaderTitle>
                    <span className="title">{t("cart.title")}</span>
                    <span className="count">{countText}</span>
                </CartHeaderTitle>

                <ClearAllButton
                    variant="outlined"
                    startIcon={<Trash fontSize="small" />}
                    onClick={clearCart}
                >
                    {t("cart.clearCart")}
                </ClearAllButton>
            </CartHeader>

            <Grid container spacing={3}>
                <Grid size={{ md: 8, xs: 12 }}>
                    {cart.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </Grid>

                <Grid size={{ md: 4, xs: 12 }}>
                    <CheckoutForm />
                </Grid>
            </Grid>
        </>
    );
}
