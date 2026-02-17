import type { Metadata } from "next";
import { ShopsPageView } from "pages-sections/shops/page-view";
import { shopDataService } from "@/services/shopData.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    return { title: "فروشگاه‌ها" };
}

export default async function Page() {
    const shops = await shopDataService.getShops();

    // چون ShopsPageView props بیشتری می‌خواد، فعلاً ساده‌ترین:
    const totalShops = shops.length;
    const totalPages = 1;
    const firstIndex = totalShops ? 1 : 0;
    const lastIndex = totalShops;

    return (
        <ShopsPageView
            shops={shops as any}
            totalShops={totalShops}
            totalPages={totalPages}
            firstIndex={firstIndex}
            lastIndex={lastIndex}
        />
    );
}
