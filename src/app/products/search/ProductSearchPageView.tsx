"use client";

import { useEffect } from "react";
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
import { BrandResource, CategoryResource } from "@/types/product.types";
import { useState } from "react";

interface Props {
  searchQuery: string;
}

export default function ProductSearchPageView({ searchQuery }: Props) {
  const [brands, setBrands] = useState<BrandResource[]>([]);
  const [categories, setCategories] = useState<CategoryResource[]>([]);
  
  const { results, loading, error, filters, updateFilters, search } = useProductSearch({
    keyword: searchQuery,
    count: 20,
    paged: 1
  });

  useEffect(() => {
    search({ keyword: searchQuery, paged: 1 });
  }, [searchQuery]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          productService.getBrands(),
          productService.getCategories()
        ]);
        setBrands(brandsRes);
        setCategories(categoriesRes);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      }
    };

    fetchFilters();
  }, []);

  const handlePageChange = (page: number) => {
    updateFilters({ paged: page });
  };

  const handleSortChange = (sort: string) => {
    updateFilters({ sort: sort as any });
  };

  if (loading && results.items.length === 0) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Breadcrumbs items={[
        { label: "محصولات", href: "/products" },
        { label: `جستجو: ${searchQuery}` }
      ]} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} mt={3}>
        <Typography variant="h5">
          نتایج جستجو برای: <KeywordHighlight text={searchQuery} keyword={searchQuery} />
          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            ({results.pagination.total} محصول)
          </Typography>
        </Typography>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>مرتب‌سازی</InputLabel>
          <Select
            value={filters.sort || ''}
            label="مرتب‌سازی"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <MenuItem value="">پیش‌فرض</MenuItem>
            <MenuItem value="lowest">ارزان‌ترین</MenuItem>
            <MenuItem value="highest">گران‌ترین</MenuItem>
            <MenuItem value="most_visited">پربازدیدترین</MenuItem>
            <MenuItem value="most_sales">پرفروش‌ترین</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Typography color="error" textAlign="center" mb={3}>
          خطا در جستجو: {error}
        </Typography>
      )}

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
              محصولی یافت نشد
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

              {results.pagination.last_page > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={results.pagination.last_page}
                    page={results.pagination.current_page}
                    onChange={(_, value) => handlePageChange(value)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
