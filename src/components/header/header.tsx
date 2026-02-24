"use client";

// src/components/header/header.tsx
import React, { ComponentProps, PropsWithChildren, ReactNode } from "react";
import Box from "@mui/material/Box";

import { HeaderCategoryDropdown } from "./header-category-dropdown";
import { HeaderWrapper, StyledContainer } from "./styles";

import LogoImage from "@/components/common/LogoImage";

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
    url?: string;
}

Header.Logo = function HeaderLogo({ url }: HeaderLogoProps) {
    // ✅ Single source of truth for logo rendering (fallback, null-safe, error-safe)
    return <LogoImage src={url} width={90} height={50} maxHeight={44} />;
};

Header.CategoryDropdown = function HeaderCategoryDropdownSlot({
                                                                  children,
                                                              }: PropsWithChildren) {
    return <HeaderCategoryDropdown>{children}</HeaderCategoryDropdown>;
};

Header.Mid = function HeaderMid({ children }: PropsWithChildren) {
    return children;
};

interface HeaderRightProps extends ComponentProps<typeof Box> {}

Header.Right = function HeaderRight({ children, ...props }: HeaderRightProps) {
    return <Box {...props}>{children}</Box>;
};