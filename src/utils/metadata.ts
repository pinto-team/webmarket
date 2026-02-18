import { Metadata } from "next";
import { ShopData } from "@/types/shopData.types";
import { t } from "@/i18n/t";

export function generatePageMetadata(
    pageTitle: string,
    shopData?: ShopData | null
): Metadata {

    const shopTitle = shopData?.title || t("meta.defaultShopTitle");

    const title = t("meta.page.titleFormat", {
        page: pageTitle,
        shop: shopTitle,
    });

    const description = t("meta.page.descriptionFormat", {
        page: pageTitle,
        shop: shopTitle,
    });

    return {
        title,
        description,
        authors: [{ name: shopTitle }],
        keywords: [
            pageTitle,
            shopTitle,
            t("meta.keywords.onlineShop"),
            t("meta.keywords.ecommerce"),
        ],
    };
}
