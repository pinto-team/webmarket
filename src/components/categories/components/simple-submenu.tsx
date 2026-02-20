"use client";

import { StyledRoot } from "../category-list";
import type { CategoryMenuItem } from "models/Category.model";
import CategoryListItem from "@/components/categories/components/category-list-item";

export default function SimpleSubmenu({ data }: { data: CategoryMenuItem[] }) {
    return (
        <StyledRoot position="relative" nested>
            {data.map((item, index) => (
                <CategoryListItem
                    key={item.href || `${item.title}-${index}`}
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                    caret={!!item.children?.length}
                    render={item.children?.length ? <SimpleSubmenu data={item.children} /> : null}
                />
            ))}
        </StyledRoot>
    );
}