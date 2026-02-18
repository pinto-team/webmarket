import Link from "next/link";
import Avatar from "@mui/material/Avatar";

import Icons from "icons/duotone";
import { CategoryMenuItemWithChild } from "models/Navigation.model";
import { SubCategoryListItem } from "./styles";

import ServerImage from "@/components/common/ServerImage";

export function SubChildItem({ item }: { item: CategoryMenuItemWithChild }) {
    const { title, url = "/", icon, img } = item;
    const Icon = icon ? Icons[icon as keyof typeof Icons] : null;

    return (
        <Link href={url}>
            <SubCategoryListItem>
                {img && (
                    <Avatar className="sub-item-avatar" sx={{ bgcolor: "grey.100" }}>
                        <ServerImage
                            src={img}          // must be proxy_url template or final
                            size="48x48"
                            alt={title}
                            width={48}
                            height={48}
                            fallback="icon"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    </Avatar>
                )}

                {Icon && <Icon sx={{ fontSize: 16 }} />}
                {title}
            </SubCategoryListItem>
        </Link>
    );
}
