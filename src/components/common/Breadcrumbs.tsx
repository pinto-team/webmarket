"use client";

import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NextLink from "next/link";
import { t } from "@/i18n/t";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface Props {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
    return (
        <MuiBreadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 3 }}
        >
            <Link
                component={NextLink}
                href="/"
                underline="hover"
                color="inherit"
            >
                {t("nav.home")}
            </Link>

            {items.map((item, index) =>
                item.href && index < items.length - 1 ? (
                    <Link
                        key={index}
                        component={NextLink}
                        href={item.href}
                        underline="hover"
                        color="inherit"
                    >
                        {item.label}
                    </Link>
                ) : (
                    <Typography key={index} color="text.primary">
                        {item.label}
                    </Typography>
                )
            )}
        </MuiBreadcrumbs>
    );
}
