"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Tooltip from "@mui/material/Tooltip";

import IconComponent from "components/IconComponent";
import OverlayScrollbar from "components/overlay-scrollbar";
import renderChild from "./render-child";
import { CategoryListItem, StyledRoot } from "./styles";

import type { CategoryMenuItem } from "models/Category.model";
import { useShopData } from "@/contexts/ShopDataContext";
import type { ShopData, ProductCategory } from "@/types/shopData.types"; // ShopData رو مطابق پروژه‌ت تنظیم کن
import { t } from "@/i18n/t";

type Props = {
    data?: ShopData;
};

function toCategoryMenuItem(cat: ProductCategory): CategoryMenuItem {
    return {
        title: cat.name,
        href: `/category/${cat.slug}`,
        icon: "Category",
        children: (cat.children ?? []).map(toCategoryMenuItem),
    };
}

export default function MobileCategoriesPageView({ data }: Props) {
    const router = useRouter();
    const { shopData } = useShopData();

    const effectiveShopData = data ?? shopData;

    const categoryMenus: CategoryMenuItem[] = useMemo(() => {
        const cats = (effectiveShopData?.product_categories ?? []) as ProductCategory[];
        return cats.map(toCategoryMenuItem);
    }, [effectiveShopData?.product_categories]);

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
                                if (item.children?.length) return setSelected(item);
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
