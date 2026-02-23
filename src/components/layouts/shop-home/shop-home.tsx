"use client";

import { Fragment, PropsWithChildren, useEffect, useMemo, useRef } from "react";
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

import FooterCopyrightBar from "@/components/footer/footer-copyright-bar";

import { NavigationList } from "components/navbar";
import CategoryMenu from "components/navigation/CategoryMenu";
import { MobileMenu } from "components/mobile-navbar";
import { SecondaryHeader } from "components/secondary-header";
import { MobileNavigationBar } from "components/mobile-navigation";
import UniversalSearchBar from "components/search/UniversalSearchBar";
import { Topbar, TopbarSocialLinks } from "components/topbar";
import {
    Header,
    HeaderCart,
    HeaderLogin,
    MobileHeader,
    HeaderSearch,
} from "components/header";

import LayoutModel from "models/Layout.model";

import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";
import ProductImage from "@/components/common/ProductImage";
import { useShopData } from "@/contexts/ShopDataProvider";
import { getLogoImageUrl } from "@/utils/imageUtils";
import { safeArr, safeObj, safeStr } from "@/utils/nullSafe";
import { TopbarConfig } from "@/types/shopData.types";

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

    // ✅ images: ONLY from shopData
    const headerLogo = (getLogoImageUrl(shopData?.header_logo, "240x80", 80) || "").trim();
    const mobileLogo = (getLogoImageUrl(shopData?.mobile_logo, "240x80", 80) || "").trim();
    const footerLogo = (getLogoImageUrl(shopData?.footer_logo, "240x120", 80) || "").trim();

    const topbarData: TopbarConfig = shopData?.topbar ?? {
        label: safeStr(topbar.label, " "),
        title: safeStr(topbar.title, " "),
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

    // ✅ socials: prefer shopData.social_links (for FooterSocialLinks component)
    const socialLinks = shopData?.social_links?.length
        ? shopData.social_links.reduce((acc, link) => {
            const platform = (link?.platform || "").toLowerCase();
            const url = safeStr(link?.url, "").trim();
            if (!platform || !url) return acc;
            (acc as any)[platform] = url;
            return acc;
        }, {} as { google?: string; twitter?: string; youtube?: string; facebook?: string; instagram?: string })
        : footer.socials;

    // ✅ socials: for TopbarSocialLinks component
    const topbarSocialLinks = shopData?.social_links?.length
        ? shopData.social_links.reduce((acc, link) => {
            const url = safeStr(link?.url, "").trim();
            if (!url) return acc;
            acc[link.platform as keyof typeof acc] = url;
            return acc;
        }, {} as { twitter?: string; facebook?: string; instagram?: string; telegram?: string; whatsapp?: string; linkedin?: string })
        : topbar.socials;

    // ----------------------------
// ✅ Topbar visibility (meaningful check)
// ----------------------------
    const topbarLabelMeaningful = safeStr(topbarData.label, "").trim();
    const topbarTitleMeaningful = safeStr(topbarData.title, "").trim();

    const hasTopbarText = Boolean(topbarLabelMeaningful) || Boolean(topbarTitleMeaningful);

    const hasTopbarSocials = Boolean(
        Object.values(topbarSocialLinks || {}).some(
            (v) => safeStr(v as any, "").trim().length > 0
        )
    );

    const showTopbar = hasTopbarText || hasTopbarSocials;

// Persian digits only if meaningful
    const topbarLabel = topbarLabelMeaningful
        ? toPersianNumber(topbarLabelMeaningful)
        : "";

    const topbarTitle = topbarTitleMeaningful
        ? toPersianNumber(topbarTitleMeaningful)
        : "";



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

    // ----------------------------
    // Sticky offset calc for chrome
    // ----------------------------
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
    // Footer: content from shopData first
    // ----------------------------
    const footerDescriptionRaw = shopData?.footer_description
        ? safeStr(shopData.footer_description, "").trim()
        : safeStr(footer.description, "").trim();

    const footerDescriptionText = footerDescriptionRaw ? toPersianNumber(footerDescriptionRaw) : "";

    const phoneRaw =
        safeStr(shopData?.contact_info?.phone, "").trim() || safeStr(footer.contact.phone, "").trim();
    const phoneFa = phoneRaw ? toPersianNumber(phoneRaw) : "";

    const email =
        safeStr(shopData?.contact_info?.email, "").trim() || safeStr(footer.contact.email, "").trim();

    const address =
        safeStr(shopData?.contact_info?.address, "").trim() || safeStr(footer.contact.address, "").trim();

    // Copyright always exists
    const yearFa = toPersianNumber(new Date().getFullYear());
    const fallbackCopyright = `© ${t("footer.copyright")} ${yearFa} ${t("footer.brandName")}, ${t("footer.allRightsReserved")}`;

    const footerCopyrightRaw = shopData?.footer_copyright
        ? safeStr(shopData.footer_copyright, "")
        : safeStr(fallbackCopyright, "");

    const footerCopyrightText = footerCopyrightRaw ? toPersianNumber(footerCopyrightRaw) : " ";

    // App links
    const playStoreUrl =
        safeStr(shopData?.app_links?.google_play, "").trim() || safeStr(footer.playStoreUrl, "").trim();
    const appleStoreUrl =
        safeStr(shopData?.app_links?.app_store, "").trim() || safeStr(footer.appStoreUrl, "").trim();
    const showApps = Boolean(playStoreUrl) || Boolean(appleStoreUrl);

    // ----------------------------
    // ✅ Footer sections (Meaningful check)
    // ----------------------------
    const footerSections = safeArr(shopData?.footer_sections);

    const normalizedFooterSections = footerSections
        .map((s) => {
            const title = safeStr((s as any)?.title, "").trim();
            const links = safeArr((s as any)?.links)
                .map((l) => ({
                    title: safeStr((l as any)?.title, "").trim(),
                    url: safeStr((l as any)?.url, "").trim(),
                }))
                .filter((l) => l.title.length > 0 && l.url.length > 0);

            return { title, links };
        })
        .filter((s) => s.title.length > 0 || s.links.length > 0);

    const hasFooterSections = normalizedFooterSections.length > 0;

    // Contact presence (meaningful)
    const hasContact = Boolean(phoneRaw) || Boolean(email) || Boolean(address);

    // Social presence (meaningful)
    const hasSocialLinks = Boolean(
        safeArr(shopData?.social_links).some((l) => safeStr((l as any)?.url, "").trim().length > 0)
    );

    // Brand bits presence
    const hasBrandBits = Boolean(footerLogo) || Boolean(footerDescriptionRaw) || showApps;

    /**
     * ✅ FINAL RULE:
     * If absolutely nothing meaningful exists => show ONLY minimal copyright bar.
     */
    const hasAnyFooterData = hasBrandBits || hasFooterSections || hasContact || hasSocialLinks;

    return (
        <SnackbarProvider>
            <ErrorHandler />
            <Fragment>
                {/* ✅ Page shell: sticky footer */}
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Header chrome (topbar + headers) */}
                    <div ref={chromeRef}>
                        {showTopbar ? (
                            <Topbar>
                                {hasTopbarText ? (
                                    <Topbar.Left label={topbarLabel || " "} title={topbarTitle || " "} />
                                ) : (
                                    <div />
                                )}

                                {hasTopbarSocials ? (
                                    <Topbar.Right>
                                        <TopbarSocialLinks links={topbarSocialLinks} />
                                    </Topbar.Right>
                                ) : (
                                    <div />
                                )}
                            </Topbar>
                        ) : null}

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

                    {/* ✅ Main content grows and pushes footer down */}
                    <main style={{ flex: 1 }}>
                        {children}
                    </main>

                    <MobileNavigationBar navigation={mobileNav} />

                    {/* ---------------- FOOTER ---------------- */}
                    {hasAnyFooterData ? (
                        <Footer1>
                            <Footer1.Brand>
                                {footerLogo ? (
                                    <Link href="/" style={{ display: "inline-block" }}>
                                        <ProductImage
                                            src={footerLogo}
                                            alt={t("common.logoAlt")}
                                            size="240x120"
                                            quality={80}
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
                                ) : null}

                                {footerDescriptionText ? (
                                    <Typography
                                        variant="body1"
                                        sx={{ mt: 1, mb: 3, maxWidth: 370, color: "white", lineHeight: 1.7 }}
                                    >
                                        {footerDescriptionText}
                                    </Typography>
                                ) : null}

                                {showApps ? (
                                    <FooterApps playStoreUrl={playStoreUrl} appleStoreUrl={appleStoreUrl} />
                                ) : null}
                            </Footer1.Brand>

                            {normalizedFooterSections?.[0] ? (
                                <Footer1.Widget1>
                                    <FooterLinksWidget
                                        title={normalizedFooterSections[0].title || " "}
                                        links={normalizedFooterSections[0].links}
                                    />
                                </Footer1.Widget1>
                            ) : null}

                            {normalizedFooterSections?.[1] ? (
                                <Footer1.Widget2>
                                    <FooterLinksWidget
                                        title={normalizedFooterSections[1].title || " "}
                                        links={normalizedFooterSections[1].links}
                                    />
                                </Footer1.Widget2>
                            ) : null}

                            <Footer1.Contact>
                                {hasContact ? (
                                    <FooterContact phone={phoneFa || " "} email={email || " "} address={address || " "} />
                                ) : null}

                                {hasSocialLinks ? <FooterSocialLinks links={socialLinks} /> : null}
                            </Footer1.Contact>

                            <Footer1.Copyright>
                                <Divider sx={{ borderColor: "grey.800" }} />
                                <Typography variant="body2" sx={{ py: 3, textAlign: "center" }}>
                                    {footerCopyrightText}
                                </Typography>
                            </Footer1.Copyright>
                        </Footer1>
                    ) : (
                        <FooterCopyrightBar text={footerCopyrightText} />
                    )}
                </div>
            </Fragment>
        </SnackbarProvider>
    );
}