"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryList } from "components/categories";
import type { CategoryMenuItem } from "models/Category.model";
import type { ProductCategory } from "@/types/shopData.types";
import { productService } from "@/services/product.service";
import { buildCategoryMenuItems } from "@/utils/categoryMenu";

export default function CategoryMenu() {
    const [flatCats, setFlatCats] = useState<ProductCategory[]>([]);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await productService.getCategories(); // GET /product-cats
                if (alive) setFlatCats((res ?? []) as any);
            } catch {
                if (alive) setFlatCats([]);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const menuItems: CategoryMenuItem[] = useMemo(
        () => (flatCats.length ? buildCategoryMenuItems(flatCats) : []),
        [flatCats]
    );

    if (!menuItems.length) return null;

    return <CategoryList categories={menuItems} />;
}