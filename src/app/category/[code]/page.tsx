'use client';

import { use, useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Container,
    Typography,
    Grid,
    Box,
    CircularProgress,
    Alert,
    Button,
    MenuItem,
    TextField,
    Card,
    CardContent,
    CardActionArea,
    Pagination,
} from '@mui/material';

import NextLink from 'next/link';

import { useCategoryProducts } from '@/hooks/useCategoryProducts';
import ProductCard1 from 'components/product-cards/product-card-1';
import FilterSidebar from '@/components/product-filters/FilterSidebar';
import ViewToggle from '@/components/product-filters/ViewToggle';
import ItemsPerPage from '@/components/product-filters/ItemsPerPage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { productService } from '@/services/product.service';
import { BrandResource, CategoryResource } from '@/types/product.types';
import { ProductSearchFilters } from '@/types/search.types';
import { t } from '@/i18n/t';

const SORT_OPTION_VALUES = ['most_visited', 'most_sales', 'lowest', 'highest'] as const;
type SortOption = (typeof SORT_OPTION_VALUES)[number];

export default function CategoryPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get('paged')) || 1;

    const [brands, setBrands] = useState<BrandResource[]>([]);
    const [categories, setCategories] = useState<CategoryResource[]>([]);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [sort, setSort] = useState<SortOption>('most_visited');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filters, setFilters] = useState<ProductSearchFilters>({});

    const { data, isLoading, error, refetch } = useCategoryProducts(code, {
        paged: page,
        count: itemsPerPage,
    });

    useEffect(() => {
        Promise.all([productService.getBrands(), productService.getCategories()])
            .then(([brandsRes, categoriesRes]) => {
                setBrands(brandsRes);
                setCategories(categoriesRes);
            })
            .catch((err) => {
                console.error(t('products.filters.fetchFailed'), err);
            });
    }, []);

    const sortOptions = useMemo(
        () =>
            SORT_OPTION_VALUES.map((value) => ({
                value,
                label: t(`products.sort.${value}`),
            })),
        []
    );

    const filteredProducts = useMemo(() => {
        if (!data?.products?.items) return [];

        let filtered = [...data.products.items];

        if (filters.minPrice != null) filtered = filtered.filter((p) => p.price >= filters.minPrice!);
        if (filters.maxPrice != null) filtered = filtered.filter((p) => p.price <= filters.maxPrice!);

        if (sort === 'lowest') filtered.sort((a, b) => a.price - b.price);
        if (sort === 'highest') filtered.sort((a, b) => b.price - a.price);

        return filtered;
    }, [data, filters, sort]);

    const handlePageChange = (newPage: number) => {
        router.push(`/category/${code}?paged=${newPage}`);
    };

    if (isLoading) {
        return (
            <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 4 }}>
                <Alert severity="error" action={<Button onClick={() => refetch()}>{t('common.retry')}</Button>}>
                    {t('products.loadError')}
                </Alert>
            </Container>
        );
    }

    if (!data) return null;

    const { category, products } = data;
    const subcategories = category.children || [];

    return (
        <Container sx={{ py: 4 }}>
            <Breadcrumbs
                items={[
                    { label: t('products.breadcrumbTitle'), href: '/products' },
                    { label: category.title },
                ]}
            />

            <Box mb={4}>
                <Typography variant="h4" gutterBottom>
                    {category.title}
                </Typography>

                {category.description && (
                    <Typography variant="body1" color="text.secondary" mb={2}>
                        {category.description}
                    </Typography>
                )}

                {subcategories.length > 0 && (
                    <Box mt={3}>
                        <Typography variant="h6" mb={2}>
                            {t('categories.subcategories')}
                        </Typography>

                        <Grid container spacing={2}>
                            {subcategories.map((sub) => (
                                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={sub.code}>
                                    <Card>
                                        <CardActionArea component={NextLink} href={`/category/${sub.code}`}>
                                            <CardContent>
                                                <Typography variant="body2" textAlign="center">
                                                    {sub.title}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="body2" color="text.secondary">
                    {t('products.count', { total: filteredProducts.length })}
                </Typography>

                <Box display="flex" gap={2}>
                    <ItemsPerPage value={itemsPerPage} onChange={setItemsPerPage} />
                    <ViewToggle view={view} onChange={setView} />

                    <TextField
                        select
                        size="small"
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOption)}
                        sx={{ minWidth: 200 }}
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
                <Grid size={{ xs: 12, md: 3 }}>
                    <FilterSidebar brands={brands} categories={categories} filters={filters} onFilterChange={setFilters} />
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    {filteredProducts.length === 0 ? (
                        <Alert severity="info">{t('products.noResults')}</Alert>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredProducts.map((product: any) => (
                                <Grid
                                    size={{ xs: 12, sm: view === 'grid' ? 6 : 12, md: view === 'grid' ? 4 : 12 }}
                                    key={product.code}
                                >
                                    <ProductCard1 product={product} />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {products.pagination && products.pagination.last_page > 1 && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={products.pagination.last_page}
                                page={page}
                                onChange={(_, value) => handlePageChange(value)}
                                color="primary"
                            />
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}
