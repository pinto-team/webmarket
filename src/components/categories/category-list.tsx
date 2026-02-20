"use client";

import { styled } from "@mui/material/styles";
import CategoryListItem from "./components/category-list-item";
import { CategoryMenuItem } from "models/Category.model";
import SimpleSubmenu from "./components/simple-submenu";

export const StyledRoot = styled("div", {
    shouldForwardProp: (prop) => prop !== "position" && prop !== "nested",
})<Position>(({ theme, position, nested }) => ({
    left: 0,
    zIndex: 98,
    right: "auto",
    borderRadius: 8,
    transformOrigin: "top",
    boxShadow: theme.shadows[5],
    position: position || "unset",
    backgroundColor: theme.palette.background.paper,

    // ✅ اصل ماجرا: nestedها padding بالا/پایین نداشته باشن تا هم‌تراز شن
    padding: nested ? "0px" : "0.5rem 0px",

    // ✅ منوی اصلی که absolute است از پایین دکمه با فاصله باز شود
    top: position === "absolute" ? "calc(100% + 0.7rem)" : 0,
}));

// ===========================
interface Position {
    position?: "absolute" | "relative";
    nested?: boolean;
}

interface Props extends Omit<Position, "nested"> {
    categories: CategoryMenuItem[];
    position?: "absolute" | "relative";
}
// ===========================

export function CategoryList({ categories, position = "absolute" }: Props) {
    return (
        <StyledRoot position={position} nested={false}>
            {categories.map((item, index) => (
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