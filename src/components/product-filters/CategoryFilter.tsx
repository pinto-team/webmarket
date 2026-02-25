"use client";

import { useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { CategoryResource } from "@/types/product.types";
import { t } from "@/i18n/t";

interface Props {
    categories: CategoryResource[];
    selected?: string;
    onChange: (categorySlug: string) => void;
}

function normalizeTitle(cat: CategoryResource): string {
    return (cat.title || cat.name || "").toString();
}

function normalizeSlug(cat: CategoryResource): string {
    return (cat.slug || cat.code || "").toString();
}

// ✅ سرچ صحیح روی درخت: children هم prune می‌شود
function filterTree(cats: CategoryResource[], q: string): CategoryResource[] {
    if (!q) return cats;

    const query = q.toLowerCase();

    return cats
        .map((cat) => {
            const title = normalizeTitle(cat).toLowerCase();
            const children = Array.isArray(cat.children) ? filterTree(cat.children, q) : [];

            if (title.includes(query) || children.length > 0) {
                return { ...cat, children };
            }
            return null;
        })
        .filter(Boolean) as CategoryResource[];
}

export default function CategoryFilter({ categories, selected, onChange }: Props) {
    const [expanded, setExpanded] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    const toggleExpand = (slug: string) => {
        setExpanded((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]));
    };

    const filteredCategories = useMemo(() => filterTree(categories || [], search), [categories, search]);

    const renderCategory = (category: CategoryResource, level = 0) => {
        const title = normalizeTitle(category);
        const slug = normalizeSlug(category);

        if (!slug) return null;

        const hasChildren = Array.isArray(category.children) && category.children.length > 0;
        const isOpen = expanded.includes(slug);

        return (
            <div key={`${slug}-${category.id}`}>
                <ListItemButton
                    sx={{ pl: 2 + level * 2 }}
                    selected={selected === slug}
                    onClick={() => onChange(slug)}
                >
                    <ListItemText primary={title} />
                    {hasChildren ? (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(slug);
                            }}
                        >
                            {isOpen ? <ExpandLess /> : <ExpandMore />}
                        </div>
                    ) : null}
                </ListItemButton>

                {hasChildren ? (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {category.children!.map((child) => renderCategory(child, level + 1))}
                        </List>
                    </Collapse>
                ) : null}
            </div>
        );
    };

    return (
        <div>
            <Typography variant="subtitle2" mb={2}>
                {t("products.category")}
            </Typography>

            <TextField
                size="small"
                fullWidth
                placeholder={t("search.placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />

            {!categories || categories.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    {t("products.noCategories")}
                </Typography>
            ) : (
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                    <List dense>{filteredCategories.map((c) => renderCategory(c))}</List>
                </Box>
            )}
        </div>
    );
}