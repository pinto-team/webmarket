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
import { ProductResource, BrandResource, CategoryResource } from "@/types/product.types";
import FilterSidebar from "@/components/product-filters/FilterSidebar";
import ViewToggle from "@/components/product-filters/ViewToggle";
import ItemsPerPage from "@/components/product-filters/ItemsPerPage";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const SORT_OPTIONS = [
  { value: "most_visited", label: "پربازدیدترین" },
  { value: "most_sales", label: "پرفروشترین" },
  { value: "lowest", label: "ارزانترین" },
  { value: "highest", label: "گرانترین" }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResource[]>([]);
  const [brands, setBrands] = useState<BrandResource[]>([]);
  const [categories, setCategories] = useState<CategoryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("most_visited");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [filters, setFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    category?: string;
  }>({});

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('[Products Page] Fetching with brand filter:', filters.brand);
        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          productService.getProducts({ 
            sort: sort as any, 
            count: itemsPerPage, 
            paged: page,
            brand: filters.brand,
            min_price: filters.minPrice,
            max_price: filters.maxPrice
          }),
          productService.getBrands(),
          productService.getCategories()
        ]);
        setProducts(productsRes.items);
        setTotalPages(productsRes.pagination.last_page);
        setBrands(brandsRes);
        setCategories(categoriesRes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, sort, itemsPerPage, filters]);

  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Breadcrumbs items={[{ label: "محصولات" }]} />
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">محصولات</Typography>
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
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
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
            <Typography variant="body1" textAlign="center" py={8} width="100%">
              محصولی یافت نشد
            </Typography>
          ) : (
            <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid key={product.code} size={{ xs: 12, sm: view === "grid" ? 6 : 12, md: view === "grid" ? 4 : 12 }}>
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
