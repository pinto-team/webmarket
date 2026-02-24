import type { Metadata } from "next";
import type { ShopData } from "@/types/shopData.types";
import { tServer } from "@/i18n/serverT";

type InterpolationValues = Record<string, string | number>;

function interpolate(template: string, values?: InterpolationValues): string {
    if (!values) return template;

    return template.replace(/\{\{(.*?)\}\}/g, (_, rawKey) => {
        const key = String(rawKey).trim();
        const value = values[key];
        return value == null ? "" : String(value);
    });
}

export function generatePageMetadata(
    pageTitle: string,
    shopData?: ShopData | null
): Metadata {
    const shopTitle = (shopData?.title?.trim() ||
        tServer<string>("meta.defaultShopTitle")).trim();

    const cleanPageTitle = pageTitle?.trim();

    const titleFormat = tServer<string>(
        "meta.page.titleFormat",
        "{{page}} - {{shop}}"
    );

    const descFormat = tServer<string>(
        "meta.page.descriptionFormat",
        "{{page}} در {{shop}}"
    );

    const finalTitle =
        cleanPageTitle && cleanPageTitle !== shopTitle
            ? interpolate(titleFormat, {
                page: cleanPageTitle,
                shop: shopTitle,
            })
            : shopTitle;

    const finalDescription = cleanPageTitle
        ? interpolate(descFormat, {
            page: cleanPageTitle,
            shop: shopTitle,
        })
        : shopTitle;

    const onlineShop = tServer<string>("meta.keywords.onlineShop");
    const ecommerce = tServer<string>("meta.keywords.ecommerce");

    const keywords = Array.from(
        new Set(
            [cleanPageTitle, shopTitle, onlineShop, ecommerce].filter(Boolean)
        )
    );

    return {
        title: finalTitle,
        description: finalDescription,
        authors: [{ name: shopTitle }],
        keywords,

        openGraph: {
            title: finalTitle,
            description: finalDescription,
            siteName: shopTitle,
            type: "website",
        },
    };
}