import type { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getShopDataServer } from "@/utils/shopDataCache";

const vazirmatn = localFont({
  src: "../../node_modules/vazirmatn/fonts/variable/Vazirmatn[wght].ttf",
  variable: "--font-vazirmatn",
  display: "swap"
});

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
import { ShopDataProvider } from "contexts/ShopDataContext";

// REACT QUERY PROVIDER
import QueryProvider from "providers/QueryProvider";

// GLOBAL CUSTOM COMPONENTS
import RTL from "components/rtl";
import ProgressBar from "components/progress";
import LayoutWrapper from "components/layouts/LayoutWrapper";
import ShopDataLoader from "components/layouts/ShopDataLoader";

// API FUNCTIONS
import api from "utils/__api__/layout";

// IMPORT i18n SUPPORT FILE
import "i18n";

// ==============================================================
interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}
// ==============================================================

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  const title = shopData?.title || "فروشگاه آنلاین";
  
  return {
    title: {
      default: title,
      template: `%s - ${title}`
    },
    description: shopData?.footer_description || "فروشگاه آنلاین با بهترین محصولات",
    keywords: ["فروشگاه آنلاین", "خرید اینترنتی", title]
  };
}

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  const data = await api.getLayoutData();
  
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body id="body" className={vazirmatn.className} suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <SettingsProvider>
                <ShopDataProvider>
                  <ThemeProvider>
                    <RTL>
                      <ShopDataLoader>
                        {modal}
                        <LayoutWrapper data={data}>{children}</LayoutWrapper>
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