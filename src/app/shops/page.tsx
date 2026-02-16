import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import api from "utils/__api__/shop";
import { ShopsPageView } from "pages-sections/shops/page-view";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("فروشندگان", shopData);
}

export default async function Shops() {
  const { shops, meta } = await api.getShopList();
  if (!shops) return notFound();

  return (
    <ShopsPageView
      shops={shops}
      lastIndex={meta.lastIndex}
      totalPages={meta.totalPages}
      firstIndex={meta.firstIndex}
      totalShops={meta.totalShops}
    />
  );
}
