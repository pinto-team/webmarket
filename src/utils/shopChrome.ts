// src/utils/shopChrome.ts
import LayoutModel from "@/models/Layout.model";
import type { ShopData, TopbarConfig, FooterSection } from "@/types/shopData.types";

import { safeArr, safeStr } from "@/utils/nullSafe";
import {
    hasAny,
    hasAnyMeaningfulString,
    normalizeFooterSections,
    socialLinksToMap,
    safeTrim,
    isMeaningfulString,
} from "@/utils/render";
import { getLogoImageUrl } from "@/utils/imageUtils";

export interface ShopChrome {
    headerLogo: string;
    mobileLogo: string;
    footerLogo: string;

    navigation: any[];

    topbar: {
        show: boolean;
        label: string;
        title: string;
        link: string; // ✅ NEW
        socials: Record<string, string>;
    };

    footer: {
        showFullFooter: boolean;
        description: string;
        sections: FooterSection[];
        socials: Record<string, string>;
        contact: {
            phone: string;
            email: string;
            address: string;
        };
        playStoreUrl: string;
        appleStoreUrl: string;
        copyright: string;
    };
}

function filterMeaningfulMap(input?: Record<string, unknown> | null): Record<string, string> {
    if (!input) return {};
    return Object.fromEntries(
        Object.entries(input).filter(([k, v]) => isMeaningfulString(k) && isMeaningfulString(v))
    ) as Record<string, string>;
}

/**
 * Build shop chrome model from shopData + optional layout (legacy fallback)
 * ✅ Always returns stable shapes (strings, arrays, objects) to prevent crashes
 */
export function buildShopChrome(shopData?: ShopData | null, layout?: LayoutModel): ShopChrome {
    // ----------------------------
    // Logos (ONLY from shopData images)
    // ----------------------------
    const headerLogo = safeTrim(getLogoImageUrl(shopData?.header_logo, "640x240", 100), "");
    const mobileLogo = safeTrim(getLogoImageUrl(shopData?.mobile_logo, "640x240", 100), "");
    const footerLogo = safeTrim(getLogoImageUrl(shopData?.footer_logo, "640x240", 100), "");

    // ----------------------------
    // Navigation
    // ----------------------------
    const navigation = hasAny(shopData?.main_navigation)
        ? safeArr(shopData?.main_navigation).map((item) => ({
            title: safeStr(item?.title, " "),
            url: safeStr(item?.url, "/"),
            megaMenu: false as const,
            megaMenuWithSub: false as const,
            child: safeArr(item?.children).map((child) => ({
                title: safeStr(child?.title, " "),
                url: safeStr(child?.url, "/"),
                child: safeArr(child?.children).map((subChild) => ({
                    title: safeStr(subChild?.title, " "),
                    url: safeStr(subChild?.url, "/"),
                })),
            })),
        }))
        : safeArr(layout?.header?.navigation);

    // ----------------------------
    // Socials (compute once)
    // ----------------------------
    const socialFromShop = socialLinksToMap(shopData?.social_links); // already filters empty urls
    const topbarSocialFromLayout = filterMeaningfulMap((layout?.topbar?.socials ?? {}) as any);
    const footerSocialFromLayout = filterMeaningfulMap((layout?.footer?.socials ?? {}) as any);

    // ----------------------------
    // Topbar
    // ----------------------------
    const topbarConfig: TopbarConfig | undefined = shopData?.topbar;
    const topbarLink = safeTrim(topbarConfig?.link, safeTrim(layout?.topbar?.link, ""));
    const topbarLabel = safeTrim(topbarConfig?.label, safeTrim(layout?.topbar?.label, ""));
    const topbarTitle = safeTrim(topbarConfig?.title, safeTrim(layout?.topbar?.title, ""));

    const topbarSocials =
        Object.keys(socialFromShop).length > 0 ? socialFromShop : topbarSocialFromLayout;

    const showTopbar = hasAnyMeaningfulString([topbarLabel, topbarTitle, topbarLink]);
    // ----------------------------
    // Footer
    // ----------------------------
    const footerDescription = safeTrim(shopData?.footer_description, safeTrim(layout?.footer?.description, ""));

    // ✅ always stable: []
    const sections = normalizeFooterSections(shopData?.footer_sections) ?? [];

    const footerSocials =
        Object.keys(socialFromShop).length > 0 ? socialFromShop : footerSocialFromLayout;

    const phone = safeTrim(shopData?.contact_info?.phone, safeTrim(layout?.footer?.contact?.phone, ""));
    const email = safeTrim(shopData?.contact_info?.email, safeTrim(layout?.footer?.contact?.email, ""));
    const address = safeTrim(shopData?.contact_info?.address, safeTrim(layout?.footer?.contact?.address, ""));

    const playStoreUrl = safeTrim(shopData?.app_links?.google_play, safeTrim(layout?.footer?.playStoreUrl, ""));
    const appleStoreUrl = safeTrim(shopData?.app_links?.app_store, safeTrim(layout?.footer?.appStoreUrl, ""));

    const hasContact = hasAnyMeaningfulString([phone, email, address]);

    const hasBrandBits =
        footerLogo.length > 0 ||
        footerDescription.length > 0 ||
        playStoreUrl.length > 0 ||
        appleStoreUrl.length > 0;

    const showFullFooter =
        hasBrandBits || hasAny(sections) || hasContact || Object.keys(footerSocials).length > 0;

    const copyright =
        safeTrim(shopData?.footer_copyright, safeTrim((layout as any)?.footer?.copyright, "")) || " ";

    return {
        headerLogo,
        mobileLogo,
        footerLogo,
        navigation,

        topbar: {
            show: showTopbar,
            label: topbarLabel,
            title: topbarTitle,
            link: topbarLink, // ✅ fixed
            socials: {}, // ✅ topbar never shows socials (keep stable shape)
        },

        footer: {
            showFullFooter,
            description: footerDescription,
            sections,
            socials: footerSocials,
            contact: {phone, email, address},
            playStoreUrl,
            appleStoreUrl,
            copyright,
        },
    };
}