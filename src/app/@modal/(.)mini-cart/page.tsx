"use client";

import Drawer from "@mui/material/Drawer";
import { MiniCart } from "pages-sections/mini-cart";

import { useCart } from "@/contexts/CartContext";

export default function MiniCartDrawer() {
    const { isMiniCartOpen, closeMiniCart } = useCart();

    return (
        <Drawer
            open={isMiniCartOpen}
            anchor="right"
            onClose={closeMiniCart}
            sx={{ zIndex: 9999 }}
            ModalProps={{ keepMounted: true }}
        >
            <MiniCart />
        </Drawer>
    );
}