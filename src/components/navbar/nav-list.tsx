"use client";

import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

import { NavLink } from "components/nav-link";
import FlexBox from "components/flex-box/flex-box";

import MegaMenu from "./mega-menu";
import NavItemChild from "./nav-item-child";
import { CategoryBasedMenu } from "./category-based-menu";

import { NAV_LINK_STYLES, ChildNavListWrapper } from "./styles";

import type {
    Menu,
    MenuItem as SimpleMenuItem,
    MenuItemWithChild,
} from "models/Navigation.model";

type Props = { navigation: Menu[] };

// ---------- Type Guards ----------
const isSimpleMenu = (nav: Menu): nav is SimpleMenuItem =>
    nav.megaMenu === false && nav.megaMenuWithSub === false;

const hasChildren = (child: unknown): child is MenuItemWithChild[] =>
    Array.isArray(child) && child.length > 0;

// ---------- Component ----------
export function NavigationList({ navigation }: Props) {
    const renderNestLevel = (children: MenuItemWithChild[]) => {
        if (!hasChildren(children)) return [];

        return children.map((nav) => {
            const key = `${nav.title}-${nav.url ?? "group"}`;

            if (hasChildren(nav.child)) {
                return (
                    <NavItemChild nav={nav} key={key}>
                        {renderNestLevel(nav.child)}
                    </NavItemChild>
                );
            }

            if (!nav.url) return null;

            return (
                <NavLink href={nav.url} key={key}>
                    <MenuItem>{nav.title}</MenuItem>
                </NavLink>
            );
        }).filter(Boolean);
    };

    const renderRootLevel = (list: Menu[]) => {
        return list.map((nav) => {
            const key = nav.title;

            // 1️⃣ Mega Menu
            if (nav.megaMenu) {
                return <MegaMenu key={key} title={nav.title} menuList={nav.child} />;
            }

            // 2️⃣ Category Mega Menu
            if (nav.megaMenuWithSub) {
                return <CategoryBasedMenu key={key} title={nav.title} menuList={nav.child} />;
            }

            // 3️⃣ Simple Menu (Type Narrowed Here)
            if (isSimpleMenu(nav)) {
                const hasChildItems = hasChildren(nav.child);

                if (hasChildItems) {
                    const renderedChildren = renderNestLevel(nav.child);

                    if (renderedChildren.length === 0) {
                        return (
                            <NavLink href={nav.url ?? "/"} key={key}>
                                <FlexBox sx={NAV_LINK_STYLES}>{nav.title}</FlexBox>
                            </NavLink>
                        );
                    }

                    return (
                        <FlexBox
                            key={key}
                            alignItems="center"
                            position="relative"
                            flexDirection="column"
                            sx={{
                                "&:hover": {
                                    "& > .child-nav-item": {
                                        display: "block",
                                    },
                                },
                            }}
                        >
                            <FlexBox alignItems="flex-end" gap={0.3} sx={NAV_LINK_STYLES}>
                                {nav.title}
                                <KeyboardArrowDown
                                    sx={{
                                        color: "grey.500",
                                        fontSize: "1.1rem",
                                    }}
                                />
                            </FlexBox>

                            <ChildNavListWrapper className="child-nav-item">
                                <Card
                                    elevation={5}
                                    sx={{
                                        mt: 2.5,
                                        py: 1,
                                        minWidth: 100,
                                        overflow: "unset",
                                    }}
                                >
                                    {renderedChildren}
                                </Card>
                            </ChildNavListWrapper>
                        </FlexBox>
                    );
                }

                // 4️⃣ Simple link
                return (
                    <NavLink href={nav.url ?? "/"} key={key}>
                        <FlexBox sx={NAV_LINK_STYLES}>{nav.title}</FlexBox>
                    </NavLink>
                );
            }

            return null;
        }).filter(Boolean);
    };

    return <FlexBox gap={4}>{renderRootLevel(navigation)}</FlexBox>;
}