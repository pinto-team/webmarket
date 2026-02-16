import MobileCategoriesPageView from "./page-view";
// API FUNCTIONS
import api from "utils/__api__/layout";

export const dynamic = "force-dynamic";

export default async function MobileCategories() {
  const data = await api.getLayoutData();
  return <MobileCategoriesPageView data={data} />;
}
