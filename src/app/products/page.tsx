"use client";

import { useState, useEffect, useMemo } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import ProductCard1 from "components/product-cards/product-card-1";
import { productService } from "@/services/product.service";
import type { ProductResource, BrandResource, CategoryResource } from "@/types/product.types";
import FilterSidebar from "@/components/product-filters/FilterSidebar";
import ViewToggle from "@/components/product-filters/ViewToggle";
import ItemsPerPage from "@/components/product-filters/ItemsPerPage";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { t } from "@/i18n/t";

const SORT_OPTION_VALUES = ["most_visited", "most_sales", "lowest", "highest"] as const;
type SortOption = (typeof SORT_OPTION_VALUES)[number];

const SORT_OPTION_LABEL_KEY: Record<SortOption, string> = {
    most_visited: "products.sort.mostVisited",
    most_sales: "products.sort.mostSales",
    lowest: "products.sort.lowest",
    highest: "products.sort.highest",
};

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResource[]>([]);
    const [brands, setBrands] = useState<BrandResource[]>([]);
    const [categories, setCategories] = useState<CategoryResource[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [sort, setSort] = useState<SortOption>("most_visited");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const [filters, setFilters] = useState<{
        minPrice?: number;
        maxPrice?: number;
        brand?: string;
        category?: string;
    }>({});

    // reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [productsRes, brandsRes, categoriesRes] = await Promise.all([
                    productService.getProducts({
                        sort: sort as any,
                        count: itemsPerPage,
                        paged: page,
                        brand: filters.brand,
                        // NOTE: your UI has category but request didn't send it; keep if backend supports it
                        category: filters.category as any,
                        min_price: filters.minPrice,
                        max_price: filters.maxPrice,
                    } as any),
                    productService.getBrands(),
                    productService.getCategories(),
                ]);

                setProducts(productsRes.items);
                setTotalPages(productsRes.pagination?.last_page ?? 1);
                setBrands(brandsRes);
                setCategories(categoriesRes);
            } catch (err) {
                console.error(t("products.logs.fetchFailed"), err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, sort, itemsPerPage, filters]);

    const sortOptions = useMemo(() => {
        return SORT_OPTION_VALUES.map((value) => ({
            value,
            label: t(SORT_OPTION_LABEL_KEY[value]),
        }));
    }, []);

    const filteredProducts = useMemo(() => products, [products]);

    if (loading) {
        return (
            <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Breadcrumbs items={[{ label: t("products.title") }]} />

            {/* Header: responsive */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", md: "center" },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Typography variant="h4" sx={{ whiteSpace: "nowrap" }}>
                    {t("products.title")}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        justifyContent: { xs: "flex-start", md: "flex-end" },
                        alignItems: "center",
                    }}
                >
                    {/* Each control on mobile should not force overflow */}
                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <ItemsPerPage value={itemsPerPage} onChange={setItemsPerPage} />
                    </Box>

                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <ViewToggle view={view} onChange={setView} />
                    </Box>

                    <TextField
                        select
                        size="small"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        fullWidth
                        sx={{
                            width: { xs: "100%", sm: 220 },
                        }}
                    >
                        {sortOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Sidebar */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <FilterSidebar
                        brands={brands}
                        categories={categories}
                        filters={filters}
                        onFilterChange={setFilters}
                    />
                </Grid>

                {/* Products */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {filteredProducts.length === 0 ? (
                        <Typography variant="body1" textAlign="center" py={8} width="100%">
                            {t("products.noResults")}
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredProducts.map((product) => (
                                <Grid
                                    key={product.code}
                                    size={{
                                        xs: 12,
                                        sm: view === "grid" ? 6 : 12,
                                        md: view === "grid" ? 4 : 12,
                                    }}
                                >
                                    <ProductCard1 product={product} />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {filteredProducts.length > 0 && totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}