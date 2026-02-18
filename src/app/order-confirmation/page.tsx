import type { Metadata } from "next";
import { OrderConfirmationPageView } from "pages-sections/order-confirmation";

import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();

    const pageName = tServer<string>("checkout.orderConfirmation");

    return generatePageMetadata(pageName, shopData);
}

export default function OrderConfirmation() {
    return <OrderConfirmationPageView />;
}
