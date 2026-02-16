"use client";

import { Fragment, PropsWithChildren, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useShopData } from "@/contexts/ShopDataContext";
import SnackbarProvider from "components/SnackbarProvider";
import ErrorHandler from "components/ErrorHandler";

// GLOBAL CUSTOM COMPONENTS
import {
    Footer1,
    FooterApps,
    FooterContact,
    FooterLinksWidget,
    FooterSocialLinks
} from "components/footer";
import { NavigationList } from "components/navbar";
import CategoryMenu from "components/navigation/CategoryMenu";
import { MobileMenu } from "components/mobile-navbar";
import { SecondaryHeader } from "components/secondary-header";
import { MobileNavigationBar } from "components/mobile-navigation";
import UniversalSearchBar from "components/search/UniversalSearchBar";
import { Topbar, TopbarSocialLinks } from "components/topbar";
import { Header, HeaderCart, HeaderLogin, MobileHeader, HeaderSearch } from "components/header";

// CUSTOM DATA MODEL
import LayoutModel from "models/Layout.model";

// ==============================================================
interface Props extends PropsWithChildren {
    data: LayoutModel;
}
// ==============================================================

const STATIC_MOBILE_NAV = [
    { title: "خانه", href: "/", icon: "Home", badge: false },
    { title: "محصولات", href: "/products", icon: "CategoryOutlined", badge: false },
    { title: "سبد", href: "/cart", icon: "CartBag", badge: true },
    { title: "پروفایل", href: "/profile", icon: "User", badge: false }
];

export default function ShopLayout1({ children, data }: Props) {
    const { shopData } = useShopData();
    const { footer, header, topbar, mobileNavigation } = data;

    const headerLogo = shopData?.header_logo?.main_url || header.logo;
    const mobileLogo = shopData?.mobile_logo?.main_url || mobileNavigation.logo;
    const footerLogo = shopData?.footer_logo?.main_url || footer.logo;
    const topbarData = shopData?.topbar || topbar;

    // Convert MenuItem[] to Menu[] format
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
                    url: subChild.url
                }))
            }))
        }))
        : header.navigation;

    // Convert SocialLink[] to footer social links format
    const socialLinks = shopData?.social_links
        ? shopData.social_links.reduce((acc, link) => {
            acc[link.platform as keyof typeof acc] = link.url;
            return acc;
        }, {} as { google?: string; twitter?: string; youtube?: string; facebook?: string; instagram?: string })
        : footer.socials;

    // Convert SocialLink[] to topbar social links format
    const topbarSocialLinks = shopData?.social_links
        ? shopData.social_links.reduce((acc, link) => {
            acc[link.platform as keyof typeof acc] = link.url;
            return acc;
        }, {} as { twitter?: string; facebook?: string; instagram?: string; telegram?: string; whatsapp?: string; linkedin?: string })
        : topbar.socials;

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

    /**
     * ✅ Compute actual "top chrome" height (Topbar + Header + SecondaryHeader)
     * and expose it as a CSS variable used by fixed pages like /mobile-categories.
     *
     * This prevents hardcoded magic numbers like 64/112/etc.
     */
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

    return (
        <SnackbarProvider>
            <ErrorHandler />
            <Fragment>
                {/* ✅ everything that sits on top (and affects fixed pages) goes inside this wrapper */}
                <div ref={chromeRef}>
                    <Topbar>
                        <Topbar.Left label={topbarData.label} title={topbarData.title} />

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

                <MobileNavigationBar navigation={STATIC_MOBILE_NAV} />

                <Footer1>
                    <Footer1.Brand>
                        <Link href="/">
                            <Image
                                src={footerLogo}
                                alt="logo"
                                width={105}
                                height={50}
                                style={{ objectFit: "contain", maxHeight: "50px", width: "auto" }}
                            />
                        </Link>

                        <Typography variant="body1" sx={{ mt: 1, mb: 3, maxWidth: 370, color: "white", lineHeight: 1.7 }}>
                            {shopData?.footer_description || footer.description}
                        </Typography>

                        <FooterApps
                            playStoreUrl={shopData?.app_links?.google_play || footer.playStoreUrl}
                            appleStoreUrl={shopData?.app_links?.app_store || footer.appStoreUrl}
                        />
                    </Footer1.Brand>

                    {shopData?.footer_sections?.[0] && (
                        <Footer1.Widget1>
                            <FooterLinksWidget title={shopData.footer_sections[0].title} links={shopData.footer_sections[0].links} />
                        </Footer1.Widget1>
                    )}

                    {shopData?.footer_sections?.[1] && (
                        <Footer1.Widget2>
                            <FooterLinksWidget title={shopData.footer_sections[1].title} links={shopData.footer_sections[1].links} />
                        </Footer1.Widget2>
                    )}

                    {!shopData?.footer_sections && (
                        <>
                            <Footer1.Widget1>
                                <FooterLinksWidget title="درباره ما" links={footer.about} />
                            </Footer1.Widget1>
                            <Footer1.Widget2>
                                <FooterLinksWidget title="خدمات مشتریان" links={footer.customers} />
                            </Footer1.Widget2>
                        </>
                    )}

                    <Footer1.Contact>
                        <FooterContact
                            phone={shopData?.contact_info?.phone || footer.contact.phone}
                            email={shopData?.contact_info?.email || footer.contact.email}
                            address={shopData?.contact_info?.address || footer.contact.address}
                        />

                        <FooterSocialLinks links={socialLinks} />
                    </Footer1.Contact>

                    <Footer1.Copyright>
                        <Divider sx={{ borderColor: "grey.800" }} />

                        <Typography variant="body2" sx={{ py: 3, textAlign: "center", span: { fontWeight: 500 } }}>
                            {shopData?.footer_copyright || `© کلیه حقوق محفوظ است ${new Date().getFullYear()} تاوونی`}
                        </Typography>
                    </Footer1.Copyright>
                </Footer1>
            </Fragment>
        </SnackbarProvider>
    );
}
