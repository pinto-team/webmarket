import type { Metadata } from "next";
import CheckoutPageView from "pages-sections/checkout/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("تسویه حساب", shopData);
}

export default function Checkout() {
  return <CheckoutPageView />;
}
