"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import ShopLayout1 from "./shop-layout-1";
import {useShopData} from "@/contexts/ShopDataProvider";

interface Props {
    children: ReactNode;
}

const AUTH_PAGES = ["/login", "/register", "/reset-password"];

export default function LayoutWrapper({ children }: Props) {
    const pathname = usePathname();
    const { shopData } = useShopData();

    const isAuthPage = AUTH_PAGES.includes(pathname);

    if (isAuthPage) {
        return <>{children}</>;
    }

    if (!shopData) {
        return null;
    }

    return <ShopLayout1>{children}</ShopLayout1>;

}
