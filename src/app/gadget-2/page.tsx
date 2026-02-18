import type { Metadata } from "next";
import GadgetTwoPageView from "pages-sections/gadget-2/page-view";

import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import { tServer } from "@/i18n/serverT";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();

    const pageName = tServer<string>("meta.pageName.shop");

    return generatePageMetadata(pageName, shopData);
}

export default function GadgetShopTwo() {
    return <GadgetTwoPageView />;
}
