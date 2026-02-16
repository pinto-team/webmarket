import type { Metadata } from "next";
import { RegisterPageView } from "pages-sections/sessions/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("ثبت نام", shopData);
}

export default function Register() {
  return <RegisterPageView />;
}
