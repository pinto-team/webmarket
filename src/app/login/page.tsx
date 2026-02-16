import type { Metadata } from "next";
import { LoginPageView } from "pages-sections/sessions/page-view";
import { getShopDataServer } from "@/utils/shopDataCache";
import { generatePageMetadata } from "@/utils/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const shopData = await getShopDataServer();
  return generatePageMetadata("ورود", shopData);
}

export default function Login() {
  return <LoginPageView />;
}
