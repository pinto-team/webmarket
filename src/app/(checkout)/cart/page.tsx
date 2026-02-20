import type { Metadata } from "next";
import { CartPageView } from "pages-sections/cart/page-view";
import { generatePageMetadata } from "@/utils/metadata";
import { t } from "@/i18n/t";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata(t("meta.pages.cart"));
}

export default function Cart() {
    return <CartPageView />;
}
