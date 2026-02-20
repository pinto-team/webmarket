import type { Metadata } from "next";
import type { ReactNode } from "react";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Vazirmatn } from "next/font/google";

import "overlayscrollbars/overlayscrollbars.css";

// THEME PROVIDER
import ThemeProvider from "theme/theme-provider";

// AUTH PROVIDER
import { AuthProvider } from "contexts/AuthContext";

// PRODUCT CART PROVIDER
import CartProvider from "contexts/CartContext";

// SITE SETTINGS PROVIDER
import SettingsProvider from "contexts/SettingContext";

// SHOP DATA PROVIDER

// REACT QUERY PROVIDER
import QueryProvider from "providers/QueryProvider";

// GLOBAL CUSTOM COMPONENTS
import RTL from "components/rtl";
import ProgressBar from "components/progress";
import LayoutWrapper from "components/layouts/LayoutWrapper";
import ShopDataLoader from "components/layouts/ShopDataLoader";

import { getShopDataServer } from "@/utils/shopDataCache";
import { tServer } from "@/i18n/serverT";
import {ShopDataProvider} from "@/contexts/ShopDataProvider";

export const revalidate = 300;

const vazirmatn = Vazirmatn({
    subsets: ["arabic"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-vazirmatn",
});

interface RootLayoutProps {
    children: ReactNode;
    modal: ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
    const title = tServer<string>("meta.defaultTitle");
    const description = tServer<string>("meta.defaultDescription");
    const keywords: string[] =
        Array.isArray(tServer<string[]>("meta.defaultKeywords"))
            ? tServer<string[]>("meta.defaultKeywords")
            : [];

    return {
        title: {
            default: title,
            template: `%s - ${title}`,
        },
        description,
        keywords,
    };
}

export default async function RootLayout({ children, modal }: RootLayoutProps) {
    const initialShopData = await getShopDataServer();

    return (
        <html
            lang="fa"
            dir="rtl"
            suppressHydrationWarning
            className={vazirmatn.variable}
        >
        <body
            id="body"
            className={vazirmatn.className}
            suppressHydrationWarning
        >
        <QueryProvider>
            <AuthProvider>
                <CartProvider>
                    <SettingsProvider>
                        <ShopDataProvider initialShopData={initialShopData}>
                            <ThemeProvider>
                                <RTL>
                                    <ShopDataLoader>
                                        {modal}
                                        <LayoutWrapper>{children}</LayoutWrapper>
                                    </ShopDataLoader>
                                </RTL>

                                <ProgressBar />
                            </ThemeProvider>
                        </ShopDataProvider>
                    </SettingsProvider>
                </CartProvider>
            </AuthProvider>
        </QueryProvider>

        <GoogleAnalytics gaId="G-XKPD36JXY0" />
        </body>
        </html>
    );
}
