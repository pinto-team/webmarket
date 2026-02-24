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
import { Topbar } from "components/topbar"; // ✅ no socials in topbar
import { Header, HeaderCart, HeaderLogin, MobileHeader, HeaderSearch } from "components/header";

import LayoutModel from "models/Layout.model";

import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";
import ProductImage from "@/components/common/ProductImage";
import { useShopData } from "@/contexts/ShopDataProvider";
import { buildShopChrome } from "@/utils/shopChrome";

interface Props extends PropsWithChildren {
    data?: LayoutModel;
}

export default function ShopHome({ children, data }: Props) {
    const { shopData } = useShopData();

    const chrome = useMemo(() => buildShopChrome(shopData, data), [shopData, data]);

    // ----------------------------
    // Mobile nav must be inside component (t() dependency)
    // ----------------------------
    const mobileNav = useMemo(
        () => [
            { title: t("nav.home"), href: "/", icon: "Home", badge: false },
            { title: t("nav.products"), href: "/products", icon: "CategoryOutlined", badge: false },
            { title: t("nav.cart"), href: "/cart", icon: "CartBag", badge: true },
            { title: t("nav.profile", t("dashboard.profile")), href: "/profile", icon: "User", badge: false },
        ],
        []
    );

    // ----------------------------
    // SAFE derived values
    // ----------------------------
    const footerSections = chrome.footer?.sections ?? [];
    const section1 = footerSections[0] ?? null;
    const section2 = footerSections[1] ?? null;

    const hasContact =
        Boolean(chrome.footer.contact.phone) ||
        Boolean(chrome.footer.contact.email) ||
        Boolean(chrome.footer.contact.address);

    const hasFooterSocials = Object.keys(chrome.footer.socials ?? {}).length > 0;
    const showApps = Boolean(chrome.footer.playStoreUrl) || Boolean(chrome.footer.appleStoreUrl);

    // ----------------------------
    // ✅ TOPBAR RULE: show if ANY of label/title/link exist
    // ----------------------------
    const topbarLabel = chrome.topbar.label?.trim() ?? "";
    const topbarTitle = chrome.topbar.title?.trim() ?? "";
    const topbarLink = chrome.topbar.link?.trim() ?? "";
    const showTopbar = Boolean(topbarLabel || topbarTitle || topbarLink);

    // ----------------------------
    // Persian digit formatting only where needed
    // ----------------------------
    const topbarLabelFa = topbarLabel ? toPersianNumber(topbarLabel) : "";
    const topbarTitleFa = topbarTitle ? toPersianNumber(topbarTitle) : "";

    const footerDescriptionFa = chrome.footer.description ? toPersianNumber(chrome.footer.description) : "";
    const phoneFa = chrome.footer.contact.phone ? toPersianNumber(chrome.footer.contact.phone) : "";

    const yearFa = toPersianNumber(new Date().getFullYear());
    const fallbackCopyright = `© ${t("footer.copyright")} ${yearFa} ${t("footer.brandName")}, ${t(
        "footer.allRightsReserved"
    )}`;

    const copyrightFa =
        chrome.footer.copyright?.trim().length
            ? toPersianNumber(chrome.footer.copyright)
            : toPersianNumber(fallbackCopyright);

    // ----------------------------
    // Mobile header depends on nav + logo
    // ----------------------------
    const mobileHeader = useMemo(
        () => (
            <MobileHeader>
                <MobileHeader.Left>
                    <MobileMenu navigation={chrome.navigation} />
                </MobileHeader.Left>

                <MobileHeader.Logo logoUrl={chrome.mobileLogo} />

                <MobileHeader.Right>
                    <HeaderSearch>
                        <UniversalSearchBar />
                    </HeaderSearch>

                    <HeaderLogin />
                    <HeaderCart />
                </MobileHeader.Right>
            </MobileHeader>
        ),
        [chrome.navigation, chrome.mobileLogo]
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

    return (
        <SnackbarProvider>
            <ErrorHandler />
            <Fragment>
                <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                    {/* Header chrome */}
                    <div ref={chromeRef}>
                        {showTopbar ? (
                            // ✅ Topbar can be clickable via href (see refactor you did/should do on Topbar)
                            <Topbar href={topbarLink || undefined}>
                                {(topbarLabelFa || topbarTitleFa) ? (
                                    <Topbar.Left label={topbarLabelFa || " "} title={topbarTitleFa || " "} />
                                ) : (
                                    // اگر فقط لینک داریم و متن نداریم، یه جای خالی بذاریم که layout نشکنه
                                    <div />
                                )}

                                {/* ✅ no socials in topbar */}
                                <Topbar.Right />
                            </Topbar>
                        ) : null}

                        <Header mobileHeader={mobileHeader}>
                            <Header.Left>
                                <Header.Logo url={chrome.headerLogo} />
                            </Header.Left>

                            <Header.Mid>
                                <NavigationList navigation={chrome.navigation} />
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

                    {/* Main */}
                    <main style={{ flex: 1 }}>{children}</main>

                    {/* Bottom Nav */}
                    <MobileNavigationBar navigation={mobileNav} />

                    {/* Footer */}
                    {chrome.footer.showFullFooter ? (
                        <Footer1>
                            <Footer1.Brand>
                                {chrome.footerLogo ? (
                                    <Link href="/" style={{ display: "inline-block" }}>
                                        <ProductImage
                                            src={chrome.footerLogo}
                                            alt={t("common.logoAlt")}
                                            size="240x120"
                                            quality={100}
                                            noWrapper
                                            style={{
                                                objectFit: "contain",
                                                maxHeight: "44px",
                                                width: "auto",
                                                height: "44px",
                                                display: "block",
                                            }}
                                        />
                                    </Link>
                                ) : null}

                                {footerDescriptionFa ? (
                                    <Typography variant="body1" sx={{ mt: 1, mb: 3, maxWidth: 370, color: "white", lineHeight: 1.7 }}>
                                        {footerDescriptionFa}
                                    </Typography>
                                ) : null}

                                {showApps ? (
                                    <FooterApps playStoreUrl={chrome.footer.playStoreUrl} appleStoreUrl={chrome.footer.appleStoreUrl} />
                                ) : null}
                            </Footer1.Brand>

                            {section1 ? (
                                <Footer1.Widget1>
                                    <FooterLinksWidget title={section1.title || " "} links={section1.links ?? []} />
                                </Footer1.Widget1>
                            ) : null}

                            {section2 ? (
                                <Footer1.Widget2>
                                    <FooterLinksWidget title={section2.title || " "} links={section2.links ?? []} />
                                </Footer1.Widget2>
                            ) : null}

                            <Footer1.Contact>
                                {hasContact ? (
                                    <FooterContact
                                        phone={phoneFa || " "}
                                        email={chrome.footer.contact.email || " "}
                                        address={chrome.footer.contact.address || " "}
                                    />
                                ) : null}

                                {hasFooterSocials ? <FooterSocialLinks links={chrome.footer.socials as any} /> : null}
                            </Footer1.Contact>

                            <Footer1.Copyright>
                                <Divider sx={{ borderColor: "grey.800" }} />
                                <Typography variant="body2" sx={{ py: 3, textAlign: "center" }}>
                                    {copyrightFa}
                                </Typography>
                            </Footer1.Copyright>
                        </Footer1>
                    ) : (
                        <FooterCopyrightBar text={copyrightFa} />
                    )}
                </div>
            </Fragment>
        </SnackbarProvider>
    );
}