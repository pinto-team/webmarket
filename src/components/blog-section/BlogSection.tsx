"use client";

import Link from "next/link";
import { Card, CardContent, CardMedia, Container, Grid, Skeleton, Typography } from "@mui/material";

import type { BlogPost } from "@/types/shopData.types";
import { t } from "@/i18n/t";

interface BlogSectionProps {
    posts: BlogPost[];
    loading?: boolean;
}

const BLOG_PREVIEW_COUNT = 3;

export default function BlogSection({ posts, loading }: BlogSectionProps) {
    if (loading) {
        return (
            <Container sx={{ my: 6 }}>
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    {Array.from({ length: BLOG_PREVIEW_COUNT }).map((_, i) => (
                        <Grid size={{ xs: 12, md: 4 }} key={i}>
                            <Skeleton variant="rectangular" height={180} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="90%" />
                            <Skeleton variant="text" width="70%" />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    if (!posts?.length) return null;

    return (
        <Container sx={{ my: 6 }}>
            <Typography variant="h3" mb={3}>
                {t("blog.latestPostsTitle")}
            </Typography>

            <Grid container spacing={3}>
                {posts.slice(0, BLOG_PREVIEW_COUNT).map((post) => (
                    <Grid size={{ xs: 12, md: 4 }} key={post.slug}>
                        <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                            <Card sx={{ height: "100%", cursor: "pointer", "&:hover": { boxShadow: 6 } }}>
                                <CardMedia
                                    component="img"
                                    height={180}
                                    image={post.image.main_url}
                                    alt={post.title}
                                />

                                <CardContent>
                                    <Typography variant="h6" gutterBottom noWrap>
                                        {post.title}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {post.excerpt}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
