"use client";

import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
// GLOBAL CUSTOM HOOK
import { useCart } from "@/contexts/CartContext";
// CUSTOM COMPONENTS
import Trash from "icons/Trash";
import CartItem from "../cart-item";
import EmptyCart from "../empty-cart";
import CheckoutForm from "../checkout-form";
import { CartHeader, CartHeaderTitle, ClearAllButton } from "../styles";

export default function CartPageView() {
  const { t } = useTranslation();
  const { cart, clearCart } = useCart();

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <CartHeader>
        <CartHeaderTitle>
          <span className="title">سبد خرید شما</span>
          <span className="count">{cart.length} عدد کالا</span>
        </CartHeaderTitle>
        <ClearAllButton
          variant="outlined"
          startIcon={<Trash fontSize="small" />}
          onClick={clearCart}>
          حذف کل سبد خرید
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
