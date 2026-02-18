import type { Metadata } from "next";
import { PaymentPageViewNew } from "pages-sections/payment/page-view-new";

import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();

    const pageName = tServer<string>("checkout.payment");

    return generatePageMetadata(pageName, shopData);
}

export default function Payment() {
    return <PaymentPageViewNew />;
}
