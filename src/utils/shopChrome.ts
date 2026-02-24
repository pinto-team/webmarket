// src/utils/shopChrome.ts

import LayoutModel from "@/models/Layout.model";
import type {
    ShopData,
    TopbarConfig,
    FooterSection,
    SocialLink,
} from "@/types/shopData.types";

import { safeArr, safeObj, safeStr } from "@/utils/nullSafe";
import {
    hasAny,
    hasAnyMeaningfulString,
    normalizeFooterSections,
    socialLinksToMap,
} from "@/utils/render";

import { getLogoImageUrl } from "@/utils/imageUtils";

/**
 * Chrome model returned to ShopHome
 */
export interface ShopChrome {
    headerLogo: string;
    mobileLogo: string;
    footerLogo: string;

    navigation: any[];

    topbar: {
        show: boolean;
        label: string;
        title: string;
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

/**
 * Build shop chrome model from shopData + optional layout
 */
export function buildShopChrome(
    shopData?: ShopData | null,
    layout?: LayoutModel
): ShopChrome {
    const headerLogo = safeStr(
        getLogoImageUrl(shopData?.header_logo, "240x80", 80),
        ""
    ).trim();

    const mobileLogo = safeStr(
        getLogoImageUrl(shopData?.mobile_logo, "240x80", 80),
        ""
    ).trim();

    const footerLogo = safeStr(
        getLogoImageUrl(shopData?.footer_logo, "240x120", 80),
        ""
    ).trim();

    /**
     * Navigation
     */
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

    /**
     * Topbar
     */
    const topbarConfig: TopbarConfig | undefined = shopData?.topbar;

    const topbarLabel = safeStr(topbarConfig?.label, "").trim();
    const topbarTitle = safeStr(topbarConfig?.title, "").trim();

    const topbarSocials = socialLinksToMap(shopData?.social_links);

    const hasTopbarText = hasAnyMeaningfulString([topbarLabel, topbarTitle]);
    const hasTopbarSocials = Object.values(topbarSocials).length > 0;

    const showTopbar = hasTopbarText || hasTopbarSocials;

    /**
     * Footer
     */
    const footerDescription = safeStr(shopData?.footer_description, "").trim();

    const sections = normalizeFooterSections(shopData?.footer_sections);

    const footerSocials = socialLinksToMap(shopData?.social_links);

    const phone = safeStr(shopData?.contact_info?.phone, "").trim();
    const email = safeStr(shopData?.contact_info?.email, "").trim();
    const address = safeStr(shopData?.contact_info?.address, "").trim();

    const playStoreUrl = safeStr(shopData?.app_links?.google_play, "").trim();
    const appleStoreUrl = safeStr(shopData?.app_links?.app_store, "").trim();

    const hasContact = hasAnyMeaningfulString([phone, email, address]);

    const hasBrandBits =
        footerLogo.length > 0 ||
        footerDescription.length > 0 ||
        playStoreUrl.length > 0 ||
        appleStoreUrl.length > 0;

    const showFullFooter =
        hasBrandBits ||
        hasAny(sections) ||
        hasContact ||
        Object.keys(footerSocials).length > 0;

    const copyright =
        safeStr(shopData?.footer_copyright, "").trim() || " ";

    return {
        headerLogo,
        mobileLogo,
        footerLogo,
        navigation,

        topbar: {
            show: showTopbar,
            label: topbarLabel,
            title: topbarTitle,
            socials: topbarSocials,
        },

        footer: {
            showFullFooter,
            description: footerDescription,
            sections,
            socials: footerSocials,
            contact: {
                phone,
                email,
                address,
            },
            playStoreUrl,
            appleStoreUrl,
            copyright,
        },
    };
}