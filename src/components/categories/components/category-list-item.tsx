import Link from "next/link";
import { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import ChevronRight from "icons/ChevronRight";
import IconComponent from "components/IconComponent";

export const Wrapper = styled("div")(({ theme }) => ({
    position: "relative",

    "& .category-dropdown-link": {
        height: 40,
        display: "flex",
        minWidth: "278px",
        whiteSpace: "pre",
        cursor: "pointer",
        padding: "0px 1rem",
        alignItems: "center",
        transition: "all 300ms ease-in-out",
        ".title": {
            flexGrow: 1,
            paddingInlineStart: "0.75rem",
        },
    },

    "&:hover": {
        color: theme.palette.primary.main,
        background: theme.palette.action.hover,
        "& > .mega-menu": { display: "block" },
        "& > a .caret-icon": { color: theme.palette.primary.main },
    },

    ".mega-menu": {
        top: 0, // ✅ بدون عدد منفی
        zIndex: 99,
        left: "100%",
        right: "auto",
        display: "none",
        position: "absolute",

        // ✅ فاصله‌ی بصری بدون ایجاد گپ hover
        paddingLeft: 8,
        boxSizing: "border-box",
    },

    ".caret-icon": {
        fontSize: "1rem",
        color: theme.palette.grey[400],
        ":dir(rtl)": { rotate: "180deg" },
    },
}));

// ===========================
interface Props {
    href: string;
    title: string;
    icon?: string;
    caret?: boolean;
    render?: ReactNode;
}
// ===========================

export default function CategoryListItem({
                                             href,
                                             title,
                                             render,
                                             icon,
                                             caret = true,
                                         }: Props) {
    return (
        <Wrapper>
            <Link href={href}>
                <div className="category-dropdown-link">
                    {icon && <IconComponent icon={icon} fontSize="small" color="inherit" />}
                    <span className="title">{title}</span>
                    {caret && <ChevronRight fontSize="small" className="caret-icon" />}
                </div>
            </Link>

            {render && <div className="mega-menu">{render}</div>}
        </Wrapper>
    );
}