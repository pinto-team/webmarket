import React, { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
// MUI
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
// ICON COMPONENTS
import ChevronRight from "icons/ChevronRight";
// GLOBAL CUSTOM HOOKS
import useOverflowDetect from "hooks/useOverflowDetect";
// STYLED COMPONENTS
import { ParentNav, ParentNavItem } from "./styles";
// DATA TYPES
import { MenuItemWithChild } from "models/Navigation.model";

interface Props extends PropsWithChildren {
    nav: MenuItemWithChild;
}

export default function NavItemChild({ nav, children }: Props) {
    const pathname = usePathname();
    const { checkOverflow, elementRef, isRightOverflowing } = useOverflowDetect();

    const hasChildren = React.Children.count(children) > 0;

    // active if any child matches current path
    const isActive = Array.isArray(nav.child)
        ? nav.child.flat().some((item) => item?.url === pathname)
        : false;

    return (
        <ParentNav minWidth={200} active={isActive ? 1 : 0} onMouseEnter={checkOverflow}>
            <MenuItem color="grey.700">
                <Typography component="span" sx={{ flex: "1 1 0" }}>
                    {nav.title}
                </Typography>

                {/* فقط وقتی واقعاً زیرمنو داریم فلش نشون بده */}
                {hasChildren ? <ChevronRight className="arrow" /> : null}
            </MenuItem>

            {/* ✅ فقط وقتی children واقعی داریم رندر کن؛ وگرنه زیرمنوی خالی حذف میشه */}
            {hasChildren ? (
                <ParentNavItem ref={elementRef} right={isRightOverflowing} className="parent-nav-item">
                    <Card elevation={5} sx={{ py: "0.5rem", minWidth: 180, overflow: "unset" }}>
                        {children}
                    </Card>
                </ParentNavItem>
            ) : null}
        </ParentNav>
    );
}