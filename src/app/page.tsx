import type { Metadata } from "next";
import GadgetTwoPageView from "pages-sections/gadget-2/page-view";

export const metadata: Metadata = {
  title: "فروشگاه آنلاین تاوونی",
  description: "خرید آنلاین محصولات با بهترین قیمت و کیفیت",
  authors: [{ name: "Taavoni", url: "https://taavoni.online" }],
  keywords: ["فروشگاه آنلاین", "خرید اینترنتی", "تاوونی"]
};

export default function HomePage() {
  return <GadgetTwoPageView />;
}