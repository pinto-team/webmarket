'use client';

import {CategoryList} from 'components/categories';
import type {CategoryMenuItem} from 'models/Category.model';
import type {ProductCategory} from '@/types/shopData.types';
import {useShopData} from "@/contexts/ShopDataProvider";

function mapToMenuItem(cat: ProductCategory): CategoryMenuItem {
    return {
        title: cat.name,
        href: `/category/${cat.slug}`,
        children: cat.children?.map(mapToMenuItem),
        component: cat.children && cat.children.length > 0 ? 'List' : undefined
    };
}

export default function CategoryMenu() {
    const {shopData} = useShopData();
    const categories = shopData?.product_categories || [];

    if (!categories.length) return null;
    console.log("[CategoryMenu] count:", shopData?.product_categories?.length);
    console.log("[CategoryMenu] first10:", (shopData?.product_categories ?? []).slice(0, 10).map(c => c.name));

    return <CategoryList categories={categories.map(mapToMenuItem)}/>;
}
