// src/lib/fonts/vazirmatn.ts
import localFont from "next/font/local";
import { Vazirmatn as VazirmatnGoogle } from "next/font/google";

/**
 * انتخاب منبع فونت در زمان build
 * - local (پیش‌فرض): بدون نیاز به اینترنت/گوگل
 * - google: دانلود از Google Fonts (نیازمند دسترسی)
 * import { vazirmatn } from "@/lib/fonts/vazirmatn";
 */
const FONT_SOURCE = process.env.NEXT_PUBLIC_FONT_SOURCE ?? "local";

export const vazirmatn =
    FONT_SOURCE === "google"
        ? VazirmatnGoogle({
            subsets: ["arabic"],
            weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
            display: "swap",
            variable: "--font-vazirmatn",
        })
        : localFont({
            src: [
                { path: "../../fonts/vazirmatn/Vazirmatn-Thin.woff2", weight: "100", style: "normal" },
                { path: "../../fonts/vazirmatn/Vazirmatn-ExtraLight.woff2", weight: "200", style: "normal" },
                { path: "../../fonts/vazirmatn/Vazirmatn-Light.woff2", weight: "300", style: "normal" },
                { path: "../../fonts/vazirmatn/Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
                { path: "../../fonts/vazirmatn/Vazirmatn-Medium.woff2", weight: "500", style: "normal" },
                { path: "../../fonts/vazirmatn/Vazirmatn-SemiBold.woff2", weight: "600", style: "normal" },
                { path: "../../fonts/vazirmatn/Vazirmatn-Bold.woff2", weight: "700", style: "normal" },
                { path: "../../fonts/vazirmatn/Vazirmatn-ExtraBold.woff2", weight: "800", style: "normal" },
                { path: "../../fonts/vazirmatn/Vazirmatn-Black.woff2", weight: "900", style: "normal" },
            ],
            display: "swap",
            variable: "--font-vazirmatn",
        });