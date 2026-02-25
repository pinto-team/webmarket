"use client";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

import PriceRangeFilter from "./PriceRangeFilter";
import BrandFilter from "./BrandFilter";
import CategoryFilter from "./CategoryFilter";

import type { BrandResource, CategoryResource } from "@/types/product.types";
import { t } from "@/i18n/t";

type UiFilters = {
    minPrice?: number;
    maxPrice?: number;
    brand?: string;    // brand code
    category?: string; // category slug
};

interface Props {
    brands: BrandResource[];
    categories?: CategoryResource[];
    filters: UiFilters;
    onFilterChange: (patch: Partial<UiFilters>) => void;
    loading?: boolean;
}

export default function FilterSidebar({ brands, categories, filters, onFilterChange, loading }: Props) {
    const handlePriceChange = (min: number, max: number) => {
        onFilterChange({ minPrice: min, maxPrice: max });
    };

    // ✅ انتخاب برند → category پاک شود (طبق محدودیت بکند)
    const handleBrandChange = (brandCode?: string) => {
        onFilterChange({ brand: brandCode, category: undefined });
    };

    // ✅ انتخاب دسته → brand پاک شود (طبق محدودیت بکند)
    const handleCategoryChange = (categorySlug: string) => {
        onFilterChange({ category: categorySlug, brand: undefined });
    };

    const handleClearAll = () => {
        onFilterChange({
            minPrice: undefined,
            maxPrice: undefined,
            brand: undefined,
            category: undefined,
        });
    };

    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
                {t("products.filtersTitle")}
            </Typography>

            <Button size="small" onClick={handleClearAll} sx={{ mb: 2 }}>
                {t("common.clearAll")}
            </Button>

            <Divider sx={{ my: 2 }} />

            <PriceRangeFilter min={filters.minPrice} max={filters.maxPrice} onChange={handlePriceChange} />

            <Divider sx={{ my: 2 }} />

            {loading ? (
                <Box>
                    <Skeleton height={24} width="60%" />
                    <Skeleton height={32} />
                    <Skeleton height={32} />
                    <Skeleton height={32} />
                </Box>
            ) : (
                <BrandFilter brands={brands} selected={filters.brand} onChange={handleBrandChange} />
            )}

            {Array.isArray(categories) && categories.length > 0 ? (
                <>
                    <Divider sx={{ my: 2 }} />

                    {loading ? (
                        <Box>
                            <Skeleton height={24} width="60%" />
                            <Skeleton height={36} />
                            <Skeleton height={220} />
                        </Box>
                    ) : (
                        <CategoryFilter
                            categories={categories}
                            selected={filters.category}
                            onChange={handleCategoryChange}
                        />
                    )}
                </>
            ) : null}
        </Card>
    );
}