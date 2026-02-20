"use client";

import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";

import LazyImage from "components/LazyImage";
import { HeaderCategoryDropdown } from "./header-category-dropdown";
import { HeaderWrapper, StyledContainer } from "./styles";

import { t } from "@/i18n/t";

interface HeaderProps extends ComponentProps<typeof HeaderWrapper> {
    mobileHeader: ReactNode;
}

export function Header({ children, mobileHeader, ...props }: HeaderProps) {
    return (
        <HeaderWrapper {...props}>
            <StyledContainer>
                <div className="main-header">{children}</div>
                <div className="mobile-header">{mobileHeader}</div>
            </StyledContainer>
        </HeaderWrapper>
    );
}

interface HeaderLeftProps extends ComponentProps<typeof Box> {}

Header.Left = function HeaderLeft({ children, ...props }: HeaderLeftProps) {
    return (
        <Box display="flex" minWidth={100} alignItems="center" {...props}>
            {children}
        </Box>
    );
};

interface HeaderLogoProps {
    url: string;
}

Header.Logo = function HeaderLogo({ url }: HeaderLogoProps) {
    return (
        <Link href="/">
            <LazyImage
                src={url}
                alt={t("common.logoAlt")}
                width={105}
                height={50}
                style={{ objectFit: "contain", maxHeight: 50, width: "auto" }}
            />
        </Link>
    );
};

Header.CategoryDropdown = function HeaderCategoryDropdownSlot({ children }: PropsWithChildren) {
    return <HeaderCategoryDropdown>{children}</HeaderCategoryDropdown>;
};

Header.Mid = function HeaderMid({ children }: PropsWithChildren) {
    return children;
};

interface HeaderRightProps extends ComponentProps<typeof Box> {}

Header.Right = function HeaderRight({ children, ...props }: HeaderRightProps) {
    return <Box {...props}>{children}</Box>;
};