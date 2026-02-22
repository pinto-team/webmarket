"use client";

import { Fragment, PropsWithChildren, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import SnackbarProvider from "components/SnackbarProvider";
import ErrorHandler from "components/ErrorHandler";

import {
    Footer1,
    FooterApps,
    FooterContact,
    FooterLinksWidget,
    FooterSocialLinks,
} from "components/footer";

import { NavigationList } from "components/navbar";
import CategoryMenu from "components/navigation/CategoryMenu";
import { MobileMenu } from "components/mobile-navbar";
import { SecondaryHeader } from "components/secondary-header";
import { MobileNavigationBar } from "components/mobile-navigation";
import UniversalSearchBar from "components/search/UniversalSearchBar";
import { Topbar, TopbarSocialLinks } from "components/topbar";
import { Header, HeaderCart, HeaderLogin, MobileHeader, HeaderSearch } from "components/header";

import LayoutModel from "models/Layout.model";

import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";
import ProductImage from "@/components/common/ProductImage";
import { useShopData } from "@/contexts/ShopDataProvider";
import { getLogoImageUrl } from "@/utils/imageUtils";
import { safeArr, safeObj, safeStr } from "@/utils/nullSafe";
import {TopbarConfig} from "@/types/shopData.types";

interface Props extends PropsWithChildren {
    data?: LayoutModel;
}

// ✅ Minimal safe fallback: no mock content, just crash-proof structure.
const FALLBACK_LAYOUT: LayoutModel = {
    header: {
        logo: "",
        categories: [],
        categoryMenus: [],
        navigation: [],
    },
    mobileNavigation: {
        logo: "",
        version1: [],
        version2: [],
    },
    topbar: {
        title: "",
        label: "",
        socials: {},
        languageOptions: {},
    },
    footer: {
        logo: "",
        description: "",
        appStoreUrl: "",
        playStoreUrl: "",
        about: [],
        customers: [],
        socials: {
            google: "",
            twitter: "",
            youtube: "",
            facebook: "",
            instagram: "",
        },
        contact: {
            phone: "",
            email: "",
            address: "",
        },
    },
};

export default function ShopHome({ children, data }: Props) {
    const { shopData } = useShopData();

    // ✅ Prefer explicit layout data, else fallback to shopData-as-layout (legacy), else hard fallback
    const layout = safeObj<LayoutModel>(
        (data as LayoutModel) ?? (shopData as unknown as LayoutModel),
        FALLBACK_LAYOUT
    );

    const footer = safeObj(layout.footer, FALLBACK_LAYOUT.footer);
    const header = safeObj(layout.header, FALLBACK_LAYOUT.header);
    const topbar = safeObj(layout.topbar, FALLBACK_LAYOUT.topbar);
    const mobileNavigation = safeObj(layout.mobileNavigation, FALLBACK_LAYOUT.mobileNavigation);

    // ✅ images: placeholder-safe via getLogoImageUrl()
    const headerLogo = getLogoImageUrl(shopData?.header_logo, "240x80", 80) || header.logo;
    const mobileLogo = getLogoImageUrl(shopData?.mobile_logo, "240x80", 80) || mobileNavigation.logo;
    const footerLogo = getLogoImageUrl(shopData?.footer_logo, "240x120", 80) || footer.logo;

    const topbarData: TopbarConfig = shopData?.topbar ?? {
        label: topbar.label ?? " ",
        title: topbar.title ?? " ",
        link: "",
        is_active: false,
    };

    // ✅ navigation: prefer shopData.main_navigation
    const navigation = shopData?.main_navigation?.length
        ? shopData.main_navigation.map((item) => ({
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
        : safeArr(header.navigation);

    // ✅ socials: prefer shopData.social_links
    const socialLinks = shopData?.social_links?.length
        ? shopData.social_links.reduce((acc, link) => {
            const platform = (link?.platform || "").toLowerCase();
            const url = safeStr(link?.url, "");
            if (!platform || !url) return acc;
            (acc as any)[platform] = url;
            return acc;
        }, {} as { google?: string; twitter?: string; youtube?: string; facebook?: string; instagram?: string })
        : footer.socials;

    const topbarSocialLinks = shopData?.social_links?.length
        ? shopData.social_links.reduce((acc, link) => {
            acc[link.platform as keyof typeof acc] = link.url;
            return acc;
        }, {} as { twitter?: string; facebook?: string; instagram?: string; telegram?: string; whatsapp?: string; linkedin?: string })
        : topbar.socials;

    const mobileNav = useMemo(
        () => [
            { title: t("nav.home"), href: "/", icon: "Home", badge: false },
            { title: t("nav.products"), href: "/products", icon: "CategoryOutlined", badge: false },
            { title: t("nav.cart"), href: "/cart", icon: "CartBag", badge: true },
            { title: t("nav.profile", t("dashboard.profile")), href: "/profile", icon: "User", badge: false },
        ],
        []
    );

    const MOBILE_VERSION_HEADER = (
        <MobileHeader>
            <MobileHeader.Left>
                <MobileMenu navigation={navigation} />
            </MobileHeader.Left>

            <MobileHeader.Logo logoUrl={mobileLogo} />

            <MobileHeader.Right>
                <HeaderSearch>
                    <UniversalSearchBar />
                </HeaderSearch>

                <HeaderLogin />
                <HeaderCart />
            </MobileHeader.Right>
        </MobileHeader>
    );

    const chromeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = chromeRef.current;
        if (!el) return;

        const apply = () => {
            const h = el.getBoundingClientRect().height;
            document.documentElement.style.setProperty("--app-top-offset", `${Math.ceil(h)}px`);
        };

        apply();

        const ro = new ResizeObserver(() => apply());
        ro.observe(el);

        window.addEventListener("resize", apply);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", apply);
        };
    }, []);

    // ----------------------------
    // Persian digit safety layer
    // ----------------------------
    const topbarLabelRaw = safeStr(topbarData.label, " ");
    const topbarTitleRaw = safeStr(topbarData.title, " ");

    const topbarLabel = topbarLabelRaw ? toPersianNumber(topbarLabelRaw) : " ";
    const topbarTitle = topbarTitleRaw ? toPersianNumber(topbarTitleRaw) : " ";

    const footerDescriptionRaw = shopData?.footer_description
        ? safeStr(shopData.footer_description, " ")
        : safeStr(footer.description, " ");

    const footerDescriptionText = footerDescriptionRaw ? toPersianNumber(footerDescriptionRaw) : " ";

    const phoneRaw = safeStr(shopData?.contact_info?.phone, "") || safeStr(footer.contact.phone, "");
    const phoneFa = phoneRaw ? toPersianNumber(phoneRaw) : " ";

    const yearFa = toPersianNumber(new Date().getFullYear());
    const fallbackCopyright =
        `© ${t("footer.copyright")} ${yearFa} ${t("footer.brandName")}, ${t("footer.allRightsReserved")}`;

    const footerCopyrightRaw = shopData?.footer_copyright
        ? safeStr(shopData.footer_copyright, "")
        : safeStr(fallbackCopyright, "");

    const footerCopyrightText =
        footerCopyrightRaw ? toPersianNumber(footerCopyrightRaw) : " ";

    const playStoreUrl = safeStr(shopData?.app_links?.google_play, "") || safeStr(footer.playStoreUrl, "");
    const appleStoreUrl = safeStr(shopData?.app_links?.app_store, "") || safeStr(footer.appStoreUrl, "");

    const email = safeStr(shopData?.contact_info?.email, "") || safeStr(footer.contact.email, "") || " ";
    const address = safeStr(shopData?.contact_info?.address, "") || safeStr(footer.contact.address, "") || " ";

    const hasFooterSections = !!shopData?.footer_sections?.length;

    return (
        <SnackbarProvider>
            <ErrorHandler />
            <Fragment>
                <div ref={chromeRef}>
                    <Topbar>
                        <Topbar.Left label={topbarLabel} title={topbarTitle} />
                        <Topbar.Right>
                            <TopbarSocialLinks links={topbarSocialLinks} />
                        </Topbar.Right>
                    </Topbar>

                    <Header mobileHeader={MOBILE_VERSION_HEADER}>
                        <Header.Left>
                            <Header.Logo url={headerLogo} />
                        </Header.Left>

                        <Header.Mid>
                            <NavigationList navigation={navigation} />
                        </Header.Mid>

                        <Header.Right>
                            <HeaderLogin />
                            <HeaderCart />
                        </Header.Right>
                    </Header>

                    <SecondaryHeader elevation={0}>
                        <SecondaryHeader.Left>
                            <CategoryMenu />
                        </SecondaryHeader.Left>

                        <SecondaryHeader.Right>
                            <UniversalSearchBar />
                        </SecondaryHeader.Right>
                    </SecondaryHeader>
                </div>

                {children}

                <MobileNavigationBar navigation={mobileNav} />

                <Footer1>
                    <Footer1.Brand>
                        <Link href="/" style={{ display: "inline-block" }}>
                            <ProductImage
                                src={footerLogo}
                                alt={t("common.logoAlt")}
                                size="240x120"
                                quality={80}
                                fallback="icon"
                                noWrapper
                                style={{
                                    objectFit: "contain",
                                    maxHeight: "50px",
                                    width: "auto",
                                    height: "50px",
                                    display: "block",
                                }}
                            />
                        </Link>

                        <Typography
                            variant="body1"
                            sx={{ mt: 1, mb: 3, maxWidth: 370, color: "white", lineHeight: 1.7 }}
                        >
                            {footerDescriptionText}
                        </Typography>

                        <FooterApps playStoreUrl={playStoreUrl} appleStoreUrl={appleStoreUrl} />
                    </Footer1.Brand>

                    {shopData?.footer_sections?.[0] && (
                        <Footer1.Widget1>
                            <FooterLinksWidget
                                title={safeStr(shopData.footer_sections[0]?.title, " ")}
                                links={safeArr(shopData.footer_sections[0]?.links)}
                            />
                        </Footer1.Widget1>
                    )}

                    {shopData?.footer_sections?.[1] && (
                        <Footer1.Widget2>
                            <FooterLinksWidget
                                title={safeStr(shopData.footer_sections[1]?.title, " ")}
                                links={safeArr(shopData.footer_sections[1]?.links)}
                            />
                        </Footer1.Widget2>
                    )}

                    {!hasFooterSections && (
                        <>
                            <Footer1.Widget1>
                                <FooterLinksWidget title={t("footer.aboutTitle")} links={safeArr(footer.about)} />
                            </Footer1.Widget1>

                            <Footer1.Widget2>
                                <FooterLinksWidget title={t("footer.customerServicesTitle")} links={safeArr(footer.customers)} />
                            </Footer1.Widget2>
                        </>
                    )}

                    <Footer1.Contact>
                        <FooterContact phone={phoneFa} email={email} address={address} />
                        <FooterSocialLinks links={socialLinks} />
                    </Footer1.Contact>

                    <Footer1.Copyright>
                        <Divider sx={{ borderColor: "grey.800" }} />
                        <Typography variant="body2" sx={{ py: 3, textAlign: "center", span: { fontWeight: 500 } }}>
                            {footerCopyrightText}
                        </Typography>
                    </Footer1.Copyright>
                </Footer1>
            </Fragment>
        </SnackbarProvider>

    );
}
