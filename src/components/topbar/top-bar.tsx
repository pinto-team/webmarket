import Link from "next/link";
import { ComponentProps } from "react";

// STYLED COMPONENTS
import { LeftContent, RightContent, StyledChip, StyledContainer, StyledRoot } from "./styles";

// ===============================================================
interface TopbarProps extends ComponentProps<typeof StyledRoot> {
    href?: string; // ✅ NEW (optional)
}
// ===============================================================

export function Topbar({ bgColor, children, href, ...props }: TopbarProps) {
    // اگر لینک داریم، کل Topbar لینک‌دار بشه
    if (href && href.trim().length > 0) {
        const isExternal = /^https?:\/\//i.test(href);

        return (
            <StyledRoot bgColor={bgColor} {...props}>
                <Link
                    href={href}
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    style={{ display: "block", textDecoration: "none", color: "inherit" }}
                >
                    <StyledContainer>{children}</StyledContainer>
                </Link>
            </StyledRoot>
        );
    }

    return (
        <StyledRoot bgColor={bgColor} {...props}>
            <StyledContainer>{children}</StyledContainer>
        </StyledRoot>
    );
}

// ===================================================================
interface TopbarLeftProps extends ComponentProps<typeof LeftContent> {
    label: string;
    title: string;
}
// ===================================================================

Topbar.Left = function ({ label, title, ...props }: TopbarLeftProps) {
    return (
        <LeftContent {...props}>
            <div className="tag">
                <StyledChip label={label} size="small" />
                <span>{title}</span>
            </div>
        </LeftContent>
    );
};

// ======================================================================
interface TopbarRightProps extends ComponentProps<typeof RightContent> {
    // ✅ optional: اگر بعدا خواستی متن کوچیک سمت راست بذاری (مثل "مشاهده")
    text?: string;
}
// ======================================================================

Topbar.Right = function ({ text, ...props }: TopbarRightProps) {
    if (!text) return <RightContent {...props} />;
    return (
        <RightContent {...props}>
            <span>{text}</span>
        </RightContent>
    );
};