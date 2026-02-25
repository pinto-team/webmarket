"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { NavLink } from "components/nav-link";

export const CONTROL_HEIGHT = 48; // ✅ single source of truth

// COMMON STYLED OBJECT
export const NAV_LINK_STYLES = {
    fontWeight: 500,
    cursor: "pointer",
    transition: "color 150ms ease-in-out",
    "&:hover": { color: "primary.main" },
    "&:last-child": { marginRight: 0 },
};

export const StyledNavLink = styled(NavLink)({ ...NAV_LINK_STYLES });

export const ParentNav = styled(Box, {
    shouldForwardProp: (prop) => prop !== "active",
})<{ active: number }>(({ theme, active }) => ({
    position: "relative",
    ...(active && { color: theme.palette.primary.main }),
    "& .arrow": { fontSize: ".875rem" },
    ":dir(rtl) .arrow": { transform: "rotate(180deg)" },
    "&:hover": {
        color: theme.palette.primary.main,
        "& > .parent-nav-item": { display: "block" },
    },
}));

export const ParentNavItem = styled("div", {
    shouldForwardProp: (prop) => prop !== "right",
})<{ right: boolean }>(({ right }) => ({
    top: 0,
    zIndex: 5,
    left: "100%",
    paddingLeft: 8,
    display: "none",
    position: "absolute",
    ...(right && { right: "100%", left: "auto", paddingRight: 8 }),
}));

export const StyledRoot = styled(Card, {
    shouldForwardProp: (prop) => prop !== "border",
})<{ border?: number }>(({ theme, border }) => ({
    height: CONTROL_HEIGHT, // ✅ 56
    display: "block",
    overflow: "unset",
    borderRadius: "0px",
    position: "relative",
    ...(border && {
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
    }),
    [theme.breakpoints.down(1150)]: { display: "none" },
}));

export const InnerContainer = styled(Container)(() => ({
    gap: "1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}));

/**
 * ✅ Make CategoryMenuButton look/feel like TextField (outlined)
 */
export const CategoryMenuButton = styled(Button)(({ theme }) => ({
    width: 278,
    height: CONTROL_HEIGHT,
    minHeight: CONTROL_HEIGHT,

    borderRadius: 4,
    backgroundColor: theme.palette.grey[50],

    // ✅ no border at all
    border: "none",
    boxShadow: "none",

    paddingBlock: 0,
    paddingInline: 12,

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "&:hover": {
        backgroundColor: theme.palette.grey[50],
        border: "none",
        boxShadow: "none",
    },

    ".prefix": {
        gap: 8,
        flex: 1,
        display: "flex",
        alignItems: "center",
        minWidth: 0,
        ".icon": {
            fontSize: 16,
            color: theme.palette.primary.main,
            flexShrink: 0,
        },
    },

    ".dropdown-icon": {
        fontSize: 16,
        color: theme.palette.grey[400],
        flexShrink: 0,
        ...(theme.direction === "rtl" && { rotate: "180deg" }),
    },
}));

export const ChildNavListWrapper = styled("div")({
    zIndex: 5,
    left: "50%",
    top: "100%",
    display: "none",
    position: "absolute",
    transform: "translate(-50%, 0%)",
});