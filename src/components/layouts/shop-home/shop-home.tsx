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
import { buildShopChrome } from "@/utils/shopChrome";
import { renderIf } from "@/utils/render";

interface Props extends PropsWithChildren {
    data?: LayoutModel;
}

/**
 * Keep this file dumb:
 * - compute chrome model once
 * - render sections only when meaningful
 * - sticky footer shell
 */
export default function ShopHome({ children, data }: Props) {
    const { shopData } = useShopData();

    const chrome = useMemo(() => buildShopChrome(shopData, data), [shopData, data]);

    // Mobile navigation is constant
    const mobileNav = useMemo(
        () => [
            { title: t("nav.home"), href: "/", icon: "Home", badge: false },
            { title: t("nav.products"), href: "/products", icon: "CategoryOutlined", badge: false },
            { title: t("nav.cart"), href: "/cart", icon: "CartBag", badge: true },
            { title: t("nav.profile", t("dashboard.profile")), href: "/profile", icon: "User", badge: false },
        ],
        []
    );

    // Mobile header depends on nav + logo
    const MOBILE_VERSION_HEADER = useMemo(
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

    // Sticky offset calc for chrome
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

    // Persian digit formatting only where needed
    const topbarLabelFa = chrome.topbar.label ? toPersianNumber(chrome.topbar.label) : "";
    const topbarTitleFa = chrome.topbar.title ? toPersianNumber(chrome.topbar.title) : "";

    const footerDescriptionFa = chrome.footer.description ? toPersianNumber(chrome.footer.description) : "";

    const phoneFa = chrome.footer.contact.phone ? toPersianNumber(chrome.footer.contact.phone) : "";

    // Copyright must always show something
    const yearFa = toPersianNumber(new Date().getFullYear());
    const fallbackCopyright = `© ${t("footer.copyright")} ${yearFa} ${t("footer.brandName")}, ${t("footer.allRightsReserved")}`;

    const copyrightFa =
        chrome.footer.copyright?.trim().length
            ? toPersianNumber(chrome.footer.copyright)
            : toPersianNumber(fallbackCopyright);

    const showApps = Boolean(chrome.footer.playStoreUrl) || Boolean(chrome.footer.appleStoreUrl);

    const hasFooterSections = chrome.footer.sections.length > 0;

    const hasContact = Boolean(chrome.footer.contact.phone) || Boolean(chrome.footer.contact.email) || Boolean(chrome.footer.contact.address);

    const hasFooterSocials = Object.keys(chrome.footer.socials).length > 0;

    const hasTopbarText = Boolean(chrome.topbar.label) || Boolean(chrome.topbar.title);
    const hasTopbarSocials = Object.keys(chrome.topbar.socials).length > 0;

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
                        {renderIf(
                            chrome.topbar.show,
                            <Topbar>
                                {hasTopbarText ? (
                                    <Topbar.Left label={topbarLabelFa || " "} title={topbarTitleFa || " "} />
                                ) : (
                                    <div />
                                )}

                                {hasTopbarSocials ? (
                                    <Topbar.Right>
                                        <TopbarSocialLinks links={chrome.topbar.socials as any} />
                                    </Topbar.Right>
                                ) : (
                                    <div />
                                )}
                            </Topbar>
                        )}

                        <Header mobileHeader={MOBILE_VERSION_HEADER}>
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

                    {/* ✅ Main content grows and pushes footer down */}
                    <main style={{ flex: 1 }}>
                        {children}
                    </main>

                    <MobileNavigationBar navigation={mobileNav} />

                    {/* ---------------- FOOTER ---------------- */}
                    {chrome.footer.showFullFooter ? (
                        <Footer1>
                            <Footer1.Brand>
                                {renderIf(
                                    Boolean(chrome.footerLogo),
                                    <Link href="/" style={{ display: "inline-block" }}>
                                        <ProductImage
                                            src={chrome.footerLogo}
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
                                )}

                                {renderIf(
                                    Boolean(footerDescriptionFa),
                                    <Typography
                                        variant="body1"
                                        sx={{ mt: 1, mb: 3, maxWidth: 370, color: "white", lineHeight: 1.7 }}
                                    >
                                        {footerDescriptionFa}
                                    </Typography>
                                )}

                                {renderIf(
                                    showApps,
                                    <FooterApps playStoreUrl={chrome.footer.playStoreUrl} appleStoreUrl={chrome.footer.appleStoreUrl} />
                                )}
                            </Footer1.Brand>

                            {renderIf(
                                Boolean(chrome.footer.sections?.[0]),
                                <Footer1.Widget1>
                                    <FooterLinksWidget
                                        title={chrome.footer.sections[0].title || " "}
                                        links={chrome.footer.sections[0].links}
                                    />
                                </Footer1.Widget1>
                            )}

                            {renderIf(
                                Boolean(chrome.footer.sections?.[1]),
                                <Footer1.Widget2>
                                    <FooterLinksWidget
                                        title={chrome.footer.sections[1].title || " "}
                                        links={chrome.footer.sections[1].links}
                                    />
                                </Footer1.Widget2>
                            )}

                            <Footer1.Contact>
                                {renderIf(
                                    hasContact,
                                    <FooterContact
                                        phone={phoneFa || " "}
                                        email={chrome.footer.contact.email || " "}
                                        address={chrome.footer.contact.address || " "}
                                    />
                                )}

                                {renderIf(
                                    hasFooterSocials,
                                    <FooterSocialLinks links={chrome.footer.socials as any} />
                                )}
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