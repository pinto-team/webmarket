import type { Metadata } from "next";
import CheckoutPageView from "pages-sections/checkout/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();

    return generatePageMetadata(
        tServer("checkout.metaTitle"),
        shopData
    );
}

export default function Checkout() {
    return <CheckoutPageView />;
}
