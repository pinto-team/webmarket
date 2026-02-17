import type { Metadata } from "next";
import { CartPageView } from "pages-sections/cart/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { t } from "@/i18n/t";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();
    return generatePageMetadata(t("meta.pages.cart"), shopData);
}

export default function Cart() {
    return <CartPageView />;
}
