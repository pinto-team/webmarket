"use client";

import Link from "next/link";
import Avatar from "@mui/material/Avatar";

import Icons from "icons/duotone";
import type { CategoryMenuItemWithChild } from "models/Navigation.model";
import { SubCategoryListItem } from "./styles";

import ProductImage from "@/components/common/ProductImage";

export function SubChildItem({ item }: { item: CategoryMenuItemWithChild }) {
    const { title, url = "/", icon, img } = item;
    const Icon = icon ? Icons[icon as keyof typeof Icons] : null;

    return (
        <Link href={url}>
            <SubCategoryListItem>
                {img ? (
                    <Avatar className="sub-item-avatar" sx={{ bgcolor: "grey.100" }}>
                        <ProductImage
                            src={img} // ✅ proxy_url template or final url
                            size="48x48"
                            alt={title}
                            width={48}
                            height={48}
                            fallback="icon"
                            noWrapper
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    </Avatar>
                ) : null}

                {Icon ? <Icon sx={{ fontSize: 16 }} /> : null}
                {title}
            </SubCategoryListItem>
        </Link>
    );
}