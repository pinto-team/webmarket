import type { PropsWithChildren } from "react";
import ShopLayout1 from "@/components/layouts/shop-home";

export default function Layout({ children }: PropsWithChildren) {
    return <ShopLayout1>{children}</ShopLayout1>;
}
