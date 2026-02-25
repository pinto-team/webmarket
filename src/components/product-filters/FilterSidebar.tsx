"use client";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import PriceRangeFilter from "./PriceRangeFilter";
import BrandFilter from "./BrandFilter";
import CategoryFilter from "./CategoryFilter";

import type { BrandResource, CategoryResource } from "@/types/product.types";
import type { ProductSearchFilters } from "@/types/search.types";
import { t } from "@/i18n/t";

interface Props {
    brands: BrandResource[];
    categories?: CategoryResource[];
    filters: ProductSearchFilters;
    onFilterChange: (patch: Partial<ProductSearchFilters>) => void;
}

export default function FilterSidebar({ brands, categories, filters, onFilterChange }: Props) {
    const handlePriceChange = (min: number, max: number) => {
        onFilterChange({ minPrice: min, maxPrice: max, paged: 1 });
    };

    const handleBrandChange = (brandCode?: string) => {
        onFilterChange({ brand: brandCode, paged: 1 });
    };

    const handleCategoryChange = (category: string) => {
        onFilterChange({ categories: [category], paged: 1 });
    };

    const handleClearAll = () => {
        onFilterChange({
            paged: 1,
            minPrice: undefined,
            maxPrice: undefined,
            brand: undefined,
            categories: undefined,
            sort: undefined,
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

            <BrandFilter brands={brands} selected={filters.brand} onChange={handleBrandChange} />

            {Array.isArray(categories) && categories.length > 0 ? (
                <>
                    <Divider sx={{ my: 2 }} />
                    <CategoryFilter
                        categories={categories}
                        selected={filters.categories?.[0]}
                        onChange={handleCategoryChange}
                    />
                </>
            ) : null}
        </Card>
    );
}