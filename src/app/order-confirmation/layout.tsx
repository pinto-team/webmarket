import type { PropsWithChildren } from "react";
import ShopHome from "@/components/layouts/shop-home";

export default function Layout({ children }: PropsWithChildren) {
    return <ShopHome>{children}</ShopHome>;
}
