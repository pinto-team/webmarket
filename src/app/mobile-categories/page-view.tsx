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
import LayoutModel from "models/Layout.model";
import { CategoryMenuItem } from "models/Category.model";
import { useShopData } from "@/contexts/ShopDataContext";
import type { ProductCategory } from "@/types/shopData.types";

// ==============================================================
type Props = { data: LayoutModel };
// ==============================================================

// تبدیل دیتای واقعی API به مدل قالب (CategoryMenuItem)
function toCategoryMenuItem(cat: ProductCategory): CategoryMenuItem {
    return {
        title: cat.name,
        href: `/category/${cat.slug}`,
        icon: "Category",
        children: (cat.children ?? []).map(toCategoryMenuItem)
    };
}

export default function MobileCategoriesPageView({ }: Props) {
    const router = useRouter();
    const { shopData } = useShopData();

    // ✅ دسته‌بندی‌های واقعی از shopData
    const categoryMenus: CategoryMenuItem[] = useMemo(() => {
        const cats = (shopData?.product_categories ?? []) as ProductCategory[];
        return cats.map(toCategoryMenuItem);
    }, [shopData?.product_categories]);

    // ✅ انتخاب اولیه: اولین موردی که children دارد (یا اولین آیتم)
    const initialSelected = useMemo(() => {
        if (!categoryMenus.length) return undefined;
        return categoryMenus.find((x) => x.children?.length) ?? categoryMenus[0];
    }, [categoryMenus]);

    const [selected, setSelected] = useState<CategoryMenuItem | undefined>(initialSelected);

    // وقتی دیتا بعداً رسید، selected را تنظیم کن
    useEffect(() => {
        if (!selected && initialSelected) setSelected(initialSelected);
    }, [initialSelected, selected]);

    return (
        <StyledRoot>
            {/* ✅ مهم: هدر و bottom nav اینجا نباید باشد چون در ShopLayout1 رندر می‌شوند */}

            <OverlayScrollbar className="category-list">
                {categoryMenus.map((item, i) => (
                    <Tooltip key={item.href ?? i} title={item.title} placement="right" arrow>
                        <CategoryListItem
                            isActive={selected?.href === item.href}
                            onClick={() => {
                                // اگر زیر دسته دارد، همانجا نمایش بده
                                if (item.children?.length) {
                                    setSelected(item);
                                    return;
                                }
                                // اگر زیر دسته ندارد، برو صفحه دسته
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
                    <div style={{ padding: 16 }}>زیر‌دسته‌ای برای نمایش وجود ندارد</div>
                ) : (
                    <div style={{ padding: 16 }}>دسته‌بندی‌ها در حال بارگذاری است…</div>
                )}
            </div>
        </StyledRoot>
    );
}
