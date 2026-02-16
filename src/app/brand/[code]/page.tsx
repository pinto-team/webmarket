'use client';

import { use, useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Grid, Box, CircularProgress, Alert, Button, MenuItem, TextField, Pagination } from '@mui/material';
import { useBrandProducts } from '@/hooks/useBrandProducts';
import ProductCard1 from 'components/product-cards/product-card-1';
import FilterSidebar from '@/components/product-filters/FilterSidebar';
import ViewToggle from '@/components/product-filters/ViewToggle';
import ItemsPerPage from '@/components/product-filters/ItemsPerPage';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { productService } from '@/services/product.service';
import { BrandResource, CategoryResource } from '@/types/product.types';
import { ProductSearchFilters } from '@/types/search.types';

const SORT_OPTIONS = [
  { value: "most_visited", label: "پربازدیدترین" },
  { value: "most_sales", label: "پرفروشترین" },
  { value: "lowest", label: "ارزانترین" },
  { value: "highest", label: "گرانترین" }
];

export default function BrandPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('paged')) || 1;
  const [brands, setBrands] = useState<BrandResource[]>([]);
  const [categories, setCategories] = useState<CategoryResource[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("most_visited");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState<ProductSearchFilters>({});

  const { data, isLoading, error, refetch } = useBrandProducts(code, { paged: page, count: itemsPerPage });

  useEffect(() => {
    Promise.all([
      productService.getBrands(),
      productService.getCategories()
    ]).then(([brandsRes, categoriesRes]) => {
      setBrands(brandsRes);
      setCategories(categoriesRes);
    }).catch(console.error);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!data?.products?.items) return [];
    
    let filtered = [...data.products.items];
    
    if (filters.minPrice) filtered = filtered.filter(p => p.price >= filters.minPrice!);
    if (filters.maxPrice) filtered = filtered.filter(p => p.price <= filters.maxPrice!);
    
    if (sort === "lowest") filtered.sort((a, b) => a.price - b.price);
    if (sort === "highest") filtered.sort((a, b) => b.price - a.price);
    
    return filtered;
  }, [data, filters, sort]);

  const handlePageChange = (newPage: number) => {
    router.push(`/brand/${code}?paged=${newPage}`);
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
        <Alert severity="error" action={<Button onClick={() => refetch()}>تلاش مجدد</Button>}>
          خطا در بارگذاری اطلاعات
        </Alert>
      </Container>
    );
  }

  if (!data) return null;

  const { brand, products } = data;

  return (
    <Container sx={{ py: 4 }}>
      <Breadcrumbs items={[
        { label: "محصولات", href: "/products" },
        { label: brand.title }
      ]} />

      <Box mb={4}>
        <Typography variant="h4" gutterBottom>{brand.title}</Typography>
        {brand.description && (
          <Typography variant="body1" color="text.secondary" mb={2}>
            {brand.description}
          </Typography>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body2" color="text.secondary">
          {filteredProducts.length} محصول
        </Typography>
        <Box display="flex" gap={2}>
          <ItemsPerPage value={itemsPerPage} onChange={setItemsPerPage} />
          <ViewToggle view={view} onChange={setView} />
          <TextField
            select
            size="small"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <FilterSidebar 
            brands={brands} 
            categories={categories}
            filters={filters} 
            onFilterChange={setFilters} 
          />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {filteredProducts.length === 0 ? (
            <Alert severity="info">محصولی یافت نشد</Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product: any) => (
                <Grid size={{ xs: 12, sm: view === "grid" ? 6 : 12, md: view === "grid" ? 4 : 12 }} key={product.code}>
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
