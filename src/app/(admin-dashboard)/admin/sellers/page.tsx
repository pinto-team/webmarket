export const dynamic = "force-dynamic";


import { Metadata } from "next";
import { SellersPageView } from "pages-sections/vendor-dashboard/sellers/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import api from "@/utils/__api__/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("فروشندگان", shopData);
}


export default async function Sellers() {
  const sellers = await api.sellers();
  return <SellersPageView sellers={sellers} />;
}
