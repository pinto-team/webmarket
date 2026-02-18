import type { PropsWithChildren } from "react";
import ShopLayout1 from "components/layouts/shop-layout-1";

export default function Layout({ children }: PropsWithChildren) {
    return <ShopLayout1>{children}</ShopLayout1>;
}
