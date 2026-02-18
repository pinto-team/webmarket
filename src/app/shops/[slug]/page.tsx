import { notFound } from "next/navigation";
import { ShopDetailsPageView } from "pages-sections/shops/page-view";
import type { SlugParams } from "models/Common";
import { shopDataService } from "@/services/shopData.service";

export const dynamic = "force-dynamic";

export default async function Page({ params }: SlugParams) {
    const { slug } = await params;

    const shops = await shopDataService.getShops();
    const shop = (shops as any[]).find((s) => s.slug === slug);

    if (!shop) notFound();

    const filters = {};

    return <ShopDetailsPageView shop={shop} filters={filters as any} />;
}
