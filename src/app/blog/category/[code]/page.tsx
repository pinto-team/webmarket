"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@mui/material/Box";
import { usePostCategory } from "@/hooks/usePostCategory";
import { getProductThumbnail } from "@/utils/imageHelper";

export default function BlogCategoryPage() {
  const params = useParams();
  const code = params.code as string;
  const [page, setPage] = useState(1);
  const queryParams = useMemo(() => ({ count: 12, paged: page }), [page]);
  const { data, loading, error } = usePostCategory(code, queryParams);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4">دسته بندی یافت نشد</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/">خانه</Link>
        <Link href="/blog">بلاگ</Link>
        <Typography color="text.primary">{data.category.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>{data.category.name}</Typography>
      {data.category.description && (
        <Typography variant="body1" sx={{ mb: 4 }} color="text.secondary">
          {data.category.description}
        </Typography>
      )}

      <Grid container spacing={3}>
        {data.posts.items.map((post) => {
          const postUrl = post.code || post.slug;
          if (!postUrl) return null;
          
          return (
            <Grid key={postUrl} size={{ xs: 12, sm: 6, md: 4 }}>
              <Link href={`/blog/${postUrl}`} style={{ textDecoration: "none" }}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", transition: "all 0.3s", "&:hover": { transform: "translateY(-4px)", boxShadow: 6 } }}>
                <Box sx={{ position: "relative", width: "100%", height: 200, overflow: "hidden" }}>
                  <Image
                    src={getProductThumbnail(post.upload)}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                    {post.excerpt}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.created_at).toLocaleDateString("fa-IR")}
                  </Typography>
                </CardContent>
              </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>

      {data.posts.pagination && data.posts.pagination.last_page > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={data.posts.pagination.last_page}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}
