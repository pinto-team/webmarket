import type { Metadata } from "next";
import { CartPageView } from "pages-sections/cart/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("سبد خرید", shopData);
}

export default function Cart() {
  return <CartPageView />;
}
