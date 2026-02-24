"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import ShopHome from "./shop-home";
import { useShopData } from "@/contexts/ShopDataProvider";
import MiniCartDrawer from "@/app/@modal/(.)mini-cart/page";

interface Props {
    children: ReactNode;
}

const AUTH_PAGES = ["/login", "/register", "/reset-password"];

export default function LayoutWrapper({ children }: Props) {
    const pathname = usePathname();
    const { shopData } = useShopData();

    const isAuthPage = AUTH_PAGES.includes(pathname);

    // ✅ Always mount the drawer so it can open instantly (no route navigation)
    // ✅ Works even if shopData is not ready yet
    const content = isAuthPage ? (
        <>{children}</>
    ) : shopData ? (
        <ShopHome>{children}</ShopHome>
    ) : (
        // Instead of returning null (blank screen), render children minimally.
        // ShopDataLoader will refetch and fill in ShopHome once shopData arrives.
        <>{children}</>
    );

    return (
        <>
            {content}
            <MiniCartDrawer />
        </>
    );
}