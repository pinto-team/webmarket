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
    onFilterChange: (filters: ProductSearchFilters) => void;
}

export default function FilterSidebar({
                                          brands,
                                          categories,
                                          filters,
                                          onFilterChange,
                                      }: Props) {
    const handlePriceChange = (min: number, max: number) => {
        onFilterChange({ ...filters, minPrice: min, maxPrice: max });
    };

    const handleBrandChange = (brandCode?: string) => {
        onFilterChange({ ...filters, brand: brandCode });
    };

    const handleCategoryChange = (category: string) => {
        onFilterChange({ ...filters, categories: [category] });
    };

    const handleClearAll = () => {
        onFilterChange({
            ...filters,
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

            <PriceRangeFilter
                min={filters.minPrice}
                max={filters.maxPrice}
                onChange={handlePriceChange}
            />

            <Divider sx={{ my: 2 }} />

            <BrandFilter
                brands={brands}
                selected={filters.brand}
                onChange={handleBrandChange}
            />

            {Array.isArray(categories) && categories.length > 0 ? (
                <>
                    <Divider sx={{ my: 2 }} />
                    <CategoryFilter
                        categories={categories}
                        selected={filters.category ?? filters.categories?.[0]}
                        onChange={handleCategoryChange}
                    />
                </>
            ) : null}
        </Card>
    );
}