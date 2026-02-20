import type { Metadata } from "next";
import { OrderConfirmationPageView } from "pages-sections/order-confirmation";

import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    const pageName = tServer<string>("checkout.orderConfirmation");

    return generatePageMetadata(pageName);
}

export default function OrderConfirmation() {
    return <OrderConfirmationPageView />;
}
