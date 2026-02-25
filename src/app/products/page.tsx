"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
import type { ProductResource, BrandResource, CategoryResource, ProductFilters as ProductFiltersType } from "@/types/product.types";
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

type UiFilters = {
    minPrice?: number;
    maxPrice?: number;
    brand?: string;    // brand code
    category?: string; // category slug
};

function readTotalPages(pagination: any): number {
    // backend نمونه‌ی شما total_pages دارد
    return (
        pagination?.total_pages ??
        pagination?.last_page ??
        pagination?.totalPages ??
        1
    );
}

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResource[]>([]);
    const [brands, setBrands] = useState<BrandResource[]>([]);
    const [categories, setCategories] = useState<CategoryResource[]>([]);

    const [loadingMeta, setLoadingMeta] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [sort, setSort] = useState<SortOption>("most_visited");
    const [view, setView] = useState<"grid" | "list">("grid");
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const [filters, setFilters] = useState<UiFilters>({});

    // ✅ patcher: merge + reset page
    const patchFilters = useCallback((patch: Partial<UiFilters>) => {
        setPage(1);
        setFilters((prev) => ({ ...prev, ...patch }));
    }, []);

    // ✅ fetch brands + categories فقط یکبار
    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoadingMeta(true);
            try {
                const [brandsRes, categoriesRes] = await Promise.all([
                    productService.getBrands(),
                    productService.getCategories(),
                ]);

                if (cancelled) return;
                setBrands(brandsRes);
                setCategories(categoriesRes);
            } catch (err) {
                console.error(t("products.logs.fetchFailed"), err);
            } finally {
                if (!cancelled) setLoadingMeta(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // ✅ fetch products: بسته به نوع فیلتر endpoint عوض می‌شود
    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoadingProducts(true);

            // فقط پارامترهای مطمئن
            const params: ProductFiltersType = {
                paged: page,
                count: itemsPerPage,
                sort: sort as any,
            };

            // اگر بکند با min/max خطا می‌دهد، همین دو خط را حذف کن
            if (typeof filters.minPrice === "number") (params as any).min_price = filters.minPrice;
            if (typeof filters.maxPrice === "number") (params as any).max_price = filters.maxPrice;

            try {
                // اولویت: Category > Brand > All
                if (filters.category) {
                    const res = await productService.getCategory(filters.category, params);
                    if (cancelled) return;

                    setProducts(res.products?.items ?? []);
                    setTotalPages(readTotalPages(res.products?.pagination));
                    return;
                }

                if (filters.brand) {
                    const res = await productService.getBrand(filters.brand, params);
                    if (cancelled) return;

                    setProducts(res.products?.items ?? []);
                    setTotalPages(readTotalPages(res.products?.pagination));
                    return;
                }

                const res = await productService.getProducts(params);
                if (cancelled) return;

                setProducts(res.items ?? []);
                setTotalPages(readTotalPages(res.pagination));
            } catch (err) {
                console.error(t("products.logs.fetchFailed"), err);
            } finally {
                if (!cancelled) setLoadingProducts(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [page, sort, itemsPerPage, filters.category, filters.brand, filters.minPrice, filters.maxPrice]);

    const sortOptions = useMemo(() => {
        return SORT_OPTION_VALUES.map((value) => ({
            value,
            label: t(SORT_OPTION_LABEL_KEY[value]),
        }));
    }, []);

    return (
        <Container sx={{ py: 4 }}>
            <Breadcrumbs items={[{ label: t("products.title") }]} />

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
                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <ItemsPerPage
                            value={itemsPerPage}
                            onChange={(v) => {
                                setItemsPerPage(v);
                                setPage(1);
                            }}
                        />
                    </Box>

                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <ViewToggle view={view} onChange={setView} />
                    </Box>

                    <TextField
                        select
                        size="small"
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value as SortOption);
                            setPage(1);
                        }}
                        fullWidth
                        sx={{ width: { xs: "100%", sm: 220 } }}
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
                        onFilterChange={patchFilters}
                        loading={loadingMeta}
                    />
                </Grid>

                {/* Products */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {loadingProducts ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : products.length === 0 ? (
                        <Typography variant="body1" textAlign="center" py={8} width="100%">
                            {t("products.noResults")}
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {products.map((product) => (
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

                    {!loadingProducts && products.length > 0 && totalPages > 1 && (
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