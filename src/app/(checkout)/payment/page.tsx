import type { Metadata } from "next";
import { PaymentPageViewNew } from "pages-sections/payment/page-view-new";

import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    const pageName = tServer<string>("checkout.payment");

    return generatePageMetadata(pageName);
}

export default function Payment() {
    return <PaymentPageViewNew />;
}
