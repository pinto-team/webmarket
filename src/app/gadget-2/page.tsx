import type { Metadata } from "next";
import GadgetTwoPageView from "pages-sections/gadget-2/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("فروشگاه", shopData);
}

export default function GadgetShopTwo() {
  return <GadgetTwoPageView />;
}
