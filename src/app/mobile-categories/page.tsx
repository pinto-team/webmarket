import MobileCategoriesPageView from "./page-view";
import { getShopDataServer } from "@/utils/shopDataCache";

export const dynamic = "force-dynamic";

export default async function Page() {
    const data = await getShopDataServer();
    return <MobileCategoriesPageView data={data as any} />;
}
