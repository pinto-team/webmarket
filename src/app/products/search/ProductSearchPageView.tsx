"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import ProductCard1 from "components/product-cards/product-card-1";
import KeywordHighlight from "@/components/search/KeywordHighlight";
import FilterSidebar from "@/components/product-filters/FilterSidebar";
import Breadcrumbs from "@/components/common/Breadcrumbs";

import { useProductSearch } from "@/hooks/useProductSearch";
import { productService } from "@/services/product.service";
import type { BrandResource, CategoryResource } from "@/types/product.types";
import { t } from "@/i18n/t";

interface Props {
    searchQuery: string;
}

export default function ProductSearchPageView({ searchQuery }: Props) {
    const [brands, setBrands] = useState<BrandResource[]>([]);
    const [categories, setCategories] = useState<CategoryResource[]>([]);

    const { results, loading, error, filters, updateFilters } = useProductSearch({
        keyword: searchQuery,
        count: 20,
        paged: 1,
    });

    // ✅ When URL query changes, just update filters. Hook will auto-search.
    useEffect(() => {
        updateFilters({
            keyword: searchQuery,
            paged: 1,

            categories: undefined,
            brand: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            sort: undefined,
        });
    }, [searchQuery, updateFilters]);

    // ✅ Fetch filter data once
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [brandsRes, categoriesRes] = await Promise.all([
                    productService.getBrands(),
                    productService.getCategories(),
                ]);
                setBrands(brandsRes);
                setCategories(categoriesRes);
            } catch (err) {
                console.error("Failed to fetch filter data:", err);
            }
        };

        fetchFilters();
    }, []);

    const handlePageChange = (page: number) => updateFilters({ paged: page });
    const handleSortChange = (sort: string) => updateFilters({ sort: sort as any, paged: 1 });

    if (loading && results.items.length === 0) {
        return (
            <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    const leftParen = t("common.leftParen");
    const rightParen = t("common.rightParen");

    return (
        <Container sx={{ py: 4 }}>
            <Breadcrumbs
                items={[
                    { label: t("products.breadcrumbTitle"), href: "/products" },
                    { label: t("products.searchBreadcrumb", { keyword: searchQuery }) },
                ]}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} mt={3}>
                <Typography variant="h5">
                    {t("products.searchResultsFor", { keyword: "" })}
                    <KeywordHighlight text={searchQuery} keyword={searchQuery} />
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        {leftParen}
                        {t("products.searchCount", { total: results.pagination.total })}
                        {rightParen}
                    </Typography>
                </Typography>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>{t("products.sort.label")}</InputLabel>
                    <Select
                        value={filters.sort || ""}
                        label={t("products.sort.label")}
                        onChange={(e) => handleSortChange(String(e.target.value))}
                    >
                        <MenuItem value="">{t("products.sort.default")}</MenuItem>
                        <MenuItem value="lowest">{t("products.sort.lowest")}</MenuItem>
                        <MenuItem value="highest">{t("products.sort.highest")}</MenuItem>
                        <MenuItem value="most_visited">{t("products.sort.mostVisited")}</MenuItem>
                        <MenuItem value="most_sales">{t("products.sort.mostSales")}</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {error ? (
                <Typography color="error" textAlign="center" mb={3}>
                    {t("products.searchError", { error })}
                </Typography>
            ) : null}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <FilterSidebar
                        brands={brands}
                        categories={categories}
                        filters={filters}
                        onFilterChange={updateFilters}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    {results.items.length === 0 ? (
                        <Typography variant="body1" textAlign="center" py={8}>
                            {t("products.noResults")}
                        </Typography>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                {results.items.map((product) => (
                                    <Grid key={product.code} size={{ xs: 12, sm: 6, md: 4 }}>
                                        <ProductCard1 product={product} />
                                    </Grid>
                                ))}
                            </Grid>

                            {results.pagination.last_page > 1 ? (
                                <Box display="flex" justifyContent="center" mt={4}>
                                    <Pagination
                                        count={results.pagination.last_page}
                                        page={results.pagination.current_page}
                                        onChange={(_, value) => handlePageChange(value)}
                                        color="primary"
                                    />
                                </Box>
                            ) : null}
                        </>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}