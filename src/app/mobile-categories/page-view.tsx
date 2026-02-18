"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// MUI
import Tooltip from "@mui/material/Tooltip";

// GLOBAL CUSTOM COMPONENTS
import IconComponent from "components/IconComponent";
import OverlayScrollbar from "components/overlay-scrollbar";

// LOCAL
import renderChild from "./render-child";

// STYLES
import { CategoryListItem, StyledRoot } from "./styles";

// TYPES
import { CategoryMenuItem } from "models/Category.model";
import { useShopData } from "@/contexts/ShopDataContext";
import type { ProductCategory } from "@/types/shopData.types";

import { t } from "@/i18n/t";

// ==============================================================

function toCategoryMenuItem(cat: ProductCategory): CategoryMenuItem {
    return {
        title: cat.name,
        href: `/category/${cat.slug}`,
        icon: "Category",
        children: (cat.children ?? []).map(toCategoryMenuItem),
    };
}

export default function MobileCategoriesPageView() {
    const router = useRouter();
    const { shopData } = useShopData();

    const categoryMenus: CategoryMenuItem[] = useMemo(() => {
        const cats = (shopData?.product_categories ?? []) as ProductCategory[];
        return cats.map(toCategoryMenuItem);
    }, [shopData?.product_categories]);

    const initialSelected = useMemo(() => {
        if (!categoryMenus.length) return undefined;
        return categoryMenus.find((x) => x.children?.length) ?? categoryMenus[0];
    }, [categoryMenus]);

    const [selected, setSelected] = useState<CategoryMenuItem | undefined>(initialSelected);

    useEffect(() => {
        if (!selected && initialSelected) setSelected(initialSelected);
    }, [initialSelected, selected]);

    return (
        <StyledRoot>
            <OverlayScrollbar className="category-list">
                {categoryMenus.map((item, i) => (
                    <Tooltip key={item.href ?? i} title={item.title} placement="right" arrow>
                        <CategoryListItem
                            isActive={selected?.href === item.href}
                            onClick={() => {
                                if (item.children?.length) {
                                    setSelected(item);
                                    return;
                                }
                                if (item.href) router.push(item.href);
                            }}
                        >
                            <IconComponent icon={(item.icon ?? "Category") as any} className="icon" />
                            <p className="title">{item.title}</p>
                        </CategoryListItem>
                    </Tooltip>
                ))}
            </OverlayScrollbar>

            <div className="container">
                {selected?.children?.length ? (
                    renderChild(selected.children)
                ) : categoryMenus.length ? (
                    <div style={{ padding: 16 }}>{t("navCategories.noSubcategories")}</div>
                ) : (
                    <div style={{ padding: 16 }}>{t("common.loading")}</div>
                )}
            </div>
        </StyledRoot>
    );
}
