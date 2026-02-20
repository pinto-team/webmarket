import type { Metadata } from "next";
import CheckoutPageView from "pages-sections/checkout/page-view";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata(
        tServer("checkout.metaTitle")
    );
}

export default function Checkout() {
    return <CheckoutPageView />;
}
