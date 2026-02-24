import type { Metadata } from "next";
import GadgetTwoPageView from "pages-sections/home/page-view";

import { tServer } from "@/i18n/serverT";
import { getShopDataServer } from "@/utils/shopDataCache";

export async function generateMetadata(): Promise<Metadata> {
    const shopData = await getShopDataServer();
    const shopTitle = (shopData?.title?.trim() || tServer<string>("meta.defaultShopTitle")).trim();

    const titleFormat = tServer<string>("meta.home.titleFormat", "{{shop}}");
    const descFormat = tServer<string>("meta.home.descriptionFormat", "{{shop}}");

    const title = titleFormat.replace("{{shop}}", shopTitle);
    const description = descFormat.replace("{{shop}}", shopTitle);

    const keywords = Array.from(
        new Set([
            shopTitle,
            tServer<string>("meta.keywords.onlineShop"),
            tServer<string>("meta.keywords.ecommerce"),
        ])
    );

    return {
        title,
        description,
        authors: [{ name: shopTitle }],
        keywords,
        icons: { icon: "/favicon.ico" }, // optional
    };
}

export default function GadgetShopTwo() {
    return <GadgetTwoPageView />;
}