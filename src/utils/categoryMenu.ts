import type { CategoryMenuItem } from "models/Category.model";
import type { ProductCategory } from "@/types/shopData.types";
import { buildCategoryTree } from "@/utils/categoryTree";

export function buildCategoryMenuItems(flatCats: ProductCategory[]): CategoryMenuItem[] {
    const tree = buildCategoryTree(flatCats);

    const mapOne = (cat: ProductCategory): CategoryMenuItem => ({
        title: cat.name,
        href: `/category/${cat.slug}`,
        component: cat.children?.length ? "Grid" : undefined, // ✅ مثل قبل
        children: cat.children?.map(mapOne),                 // ✅ خیلی مهم
    });

    return tree.map(mapOne);
}