"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Clear from "@mui/icons-material/Clear";

import { useCart } from "@/contexts/CartContext";
import MiniCartItem from "./components/cart-item";
import EmptyCartView from "./components/empty-view";

import { FlexBetween } from "components/flex-box";
import OverlayScrollbar from "components/overlay-scrollbar";

import { t } from "@/i18n/t";
import { formatPersianNumber } from "@/utils/persian";

import type { CartItemResource } from "@/types/product.types";

type CartItem = CartItemResource;

export default function MiniCart() {
    const router = useRouter();
    const { cart, updateQuantity, removeItem } = useCart();

    const cartLength = cart.length;

    const handleCartAmountChange = (amount: number, product: CartItem) => () => {
        if (amount === 0) removeItem(product.id);
        else updateQuantity(product.id, amount);
    };

    return (
        <Box height="100vh" width={380}>
            <FlexBetween ml={3} mr={2} height={74}>
                <Typography variant="h6">
                    {t("cart.title")} ({formatPersianNumber(cartLength)})
                </Typography>

                <IconButton size="small" onClick={router.back}>
                    <Clear fontSize="small" />
                </IconButton>
            </FlexBetween>

            <Divider />

            <Box height={`calc(100% - ${cartLength ? "211px" : "75px"})`}>
                {cartLength > 0 ? (
                    <OverlayScrollbar>
                        {cart.map((item) => (
                            <MiniCartItem key={item.id} item={item} onCart={handleCartAmountChange} />
                        ))}
                    </OverlayScrollbar>
                ) : (
                    <EmptyCartView />
                )}
            </Box>

            {cartLength > 0 && (
                <Box p={2.5}>
                    <Button
                        fullWidth
                        color="primary"
                        variant="contained"
                        size="medium"
                        LinkComponent={Link}
                        component={Link}
                        sx={{ mb: 1 }}
                    >
                        {t("cart.proceedToCheckout")}
                    </Button>

                    <Button
                        fullWidth
                        color="primary"
                        variant="outlined"
                        size="medium"
                        component={Link}
                        href="/cart"
                    >
                        {t("cart.viewCart")}
                    </Button>
                </Box>
            )}
        </Box>
    );
}
