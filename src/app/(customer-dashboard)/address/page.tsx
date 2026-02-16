import type { Metadata } from "next";
import { AddressPageView } from "pages-sections/customer-dashboard/address/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";
import api from "utils/__api__/address";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("آدرس‌ها", shopData);
}

// ==============================================================
interface Props {
  searchParams: Promise<{ page: string }>;
}
// ==============================================================

export default function Address() {
  return <AddressPageView />;
}
