"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
// MUI
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Clear from "@mui/icons-material/Clear";
// GLOBAL CUSTOM HOOK
import { useCart } from "@/contexts/CartContext";
// LOCAL CUSTOM COMPONENTS
import MiniCartItem from "./components/cart-item";
import EmptyCartView from "./components/empty-view";
// GLOBAL CUSTOM COMPONENT
import { FlexBetween } from "components/flex-box";
import OverlayScrollbar from "components/overlay-scrollbar";
// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
import { toPersianNumber } from "@/utils/persian";
// CUSTOM DATA MODEL
import { CartItemResource } from "@/types/product.types";

type CartItem = CartItemResource;

export default function MiniCart() {
  const { t } = useTranslation();
  const router = useRouter();
  const { cart, updateQuantity, removeItem } = useCart();
  const CART_LENGTH = cart.length;

  const handleCartAmountChange = (amount: number, product: CartItem) => () => {
    if (amount === 0) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, amount);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((acc, item) => acc + item.sku.price * item.quantity, 0);
  };

  return (
    <Box height="100vh" width={380}>
      <FlexBetween ml={3} mr={2} height={74}>
        <Typography variant="h6">{t("Your Cart")} ({toPersianNumber(CART_LENGTH)})</Typography>

        <IconButton size="small" onClick={router.back}>
          <Clear fontSize="small" />
        </IconButton>
      </FlexBetween>

      <Divider />

      <Box height={`calc(100% - ${CART_LENGTH ? "211px" : "75px"})`}>
        {CART_LENGTH > 0 ? (
          <OverlayScrollbar>
            {cart.map((item) => (
              <MiniCartItem item={item} key={item.id} onCart={handleCartAmountChange} />
            ))}
          </OverlayScrollbar>
        ) : (
          <EmptyCartView />
        )}
      </Box>

      {CART_LENGTH > 0 && (
        <Box p={2.5}>
          <Button
            fullWidth
            color="primary"
            size="small"
            variant="contained"
            LinkComponent={Link}
            href="/"
            sx={{ height: 30, mb: 1 }}>
            {t("Proceed to Checkout")}
          </Button>

          <Button
            fullWidth
            color="primary"
            size="small"
            variant="outlined"
            LinkComponent={Link}
            href="/cart"
            sx={{ height: 30 }}>
            {t("View Cart")}
          </Button>
        </Box>
      )}
    </Box>
  );
}
