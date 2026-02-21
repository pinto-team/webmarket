"use client";

import { Fragment, PropsWithChildren, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { getLogoImageUrl } from "@/utils/imageUtils";
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

interface Props extends PropsWithChildren {
    data?: LayoutModel;
}

export default function ShopHome({ children, data }: Props) {
    const { shopData } = useShopData();

    const { footer, header, topbar, mobileNavigation } =
    (data as LayoutModel) ?? (shopData as unknown as LayoutModel);

    const headerLogo = getLogoImageUrl(shopData?.header_logo, "240x80", 80) || header.logo;
    const mobileLogo = getLogoImageUrl(shopData?.mobile_logo, "240x80", 80) || mobileNavigation.logo;
    const footerLogo = getLogoImageUrl(shopData?.footer_logo, "240x120", 80) || footer.logo;
    const topbarData = shopData?.topbar || topbar;

    const navigation = shopData?.main_navigation
        ? shopData.main_navigation.map((item) => ({
            title: item.title,
            url: item.url,
            megaMenu: false as const,
            megaMenuWithSub: false as const,
            child: (item.children || []).map((child) => ({
                title: child.title,
                url: child.url,
                child: child.children?.map((subChild) => ({
                    title: subChild.title,
                    url: subChild.url,
                })),
            })),
        }))
        : header.navigation;

    const socialLinks = shopData?.social_links
        ? shopData.social_links.reduce((acc, link) => {
            acc[link.platform as keyof typeof acc] = link.url;
            return acc;
        }, {} as { google?: string; twitter?: string; youtube?: string; facebook?: string; instagram?: string })
        : footer.socials;

    const topbarSocialLinks = shopData?.social_links
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

            {/* ✅ already expects a url string, now proxy-only */}
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
    const topbarLabel = topbarData?.label ? toPersianNumber(topbarData.label) : topbarData?.label;
    const topbarTitle = topbarData?.title ? toPersianNumber(topbarData.title) : topbarData?.title;

    const footerDescriptionText =
        shopData?.footer_description
            ? toPersianNumber(shopData.footer_description)
            : footer.description;

    const phoneFa = toPersianNumber(shopData?.contact_info?.phone || footer.contact.phone);

    const yearFa = toPersianNumber(new Date().getFullYear());
    const fallbackCopyright =
        `© ${t("footer.copyright")} ${yearFa} ${t("footer.brandName")}, ${t("footer.allRightsReserved")}`;

    const footerCopyrightText =
        shopData?.footer_copyright
            ? toPersianNumber(shopData.footer_copyright)
            : fallbackCopyright;

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
                            {/* ✅ already expects url string, now proxy-only */}
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
                            {/* ✅ replace next/image with ProductImage (UI image) */}
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

                        <FooterApps
                            playStoreUrl={shopData?.app_links?.google_play || footer.playStoreUrl}
                            appleStoreUrl={shopData?.app_links?.app_store || footer.appStoreUrl}
                        />
                    </Footer1.Brand>

                    {shopData?.footer_sections?.[0] && (
                        <Footer1.Widget1>
                            <FooterLinksWidget
                                title={shopData.footer_sections[0].title}
                                links={shopData.footer_sections[0].links}
                            />
                        </Footer1.Widget1>
                    )}

                    {shopData?.footer_sections?.[1] && (
                        <Footer1.Widget2>
                            <FooterLinksWidget
                                title={shopData.footer_sections[1].title}
                                links={shopData.footer_sections[1].links}
                            />
                        </Footer1.Widget2>
                    )}

                    {!shopData?.footer_sections && (
                        <>
                            <Footer1.Widget1>
                                <FooterLinksWidget title={t("footer.aboutTitle")} links={footer.about} />
                            </Footer1.Widget1>

                            <Footer1.Widget2>
                                <FooterLinksWidget title={t("footer.customerServicesTitle")} links={footer.customers} />
                            </Footer1.Widget2>
                        </>
                    )}

                    <Footer1.Contact>
                        <FooterContact
                            phone={phoneFa}
                            email={shopData?.contact_info?.email || footer.contact.email}
                            address={shopData?.contact_info?.address || footer.contact.address}
                        />

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