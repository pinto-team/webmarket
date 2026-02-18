import type { Metadata } from "next";
import { AddressPageView } from "pages-sections/customer-dashboard/address/page-view";

import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();

    const pageName = tServer<string>("dashboard.addresses");

    return generatePageMetadata(pageName, shopData);
}

export default function Address() {
    return <AddressPageView />;
}
