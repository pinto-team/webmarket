"use client";

import { useEffect, useMemo, useState } from "react";
import { CategoryList } from "components/categories";
import type { CategoryMenuItem } from "models/Category.model";
import type { ProductCategory } from "@/types/shopData.types";
import { productService } from "@/services/product.service";
import { buildCategoryMenuItems } from "@/utils/categoryMenu";

function hasChildren(cats: ProductCategory[]): boolean {
    return cats.some((c) => Array.isArray((c as any).children) && (c as any).children.length > 0);
}

function flattenCategories(input: ProductCategory[]): ProductCategory[] {
    const out: ProductCategory[] = [];

    const walk = (nodes: ProductCategory[], parentId: number | null) => {
        for (const n of nodes) {
            const children = Array.isArray((n as any).children) ? ((n as any).children as ProductCategory[]) : [];

            const node: ProductCategory = {
                ...(n as any),
                parent_id: (n as any).parent_id ?? parentId,
                children: [],
                parent: null,
            };

            out.push(node);

            if (children.length) {
                walk(children, (n as any).id ?? null);
            }
        }
    };

    walk(input, null);
    return out;
}

export default function CategoryMenu() {
    const [catsFlat, setCatsFlat] = useState<ProductCategory[]>([]);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const res = (await productService.getCategories()) as any as ProductCategory[];

                const fixed = hasChildren(res) ? flattenCategories(res) : (res ?? []);

                if (alive) setCatsFlat(fixed);
            } catch {
                if (alive) setCatsFlat([]);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const menuItems: CategoryMenuItem[] = useMemo(
        () => (catsFlat.length ? buildCategoryMenuItems(catsFlat) : []),
        [catsFlat]
    );

    if (!menuItems.length) return null;

    return <CategoryList categories={menuItems} />;
}