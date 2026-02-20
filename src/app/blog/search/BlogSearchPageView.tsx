"use client";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";

import Link from "next/link";

import UniversalSearchBar from "@/components/search/UniversalSearchBar";
import KeywordHighlight from "@/components/search/KeywordHighlight";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ProductImage from "@/components/common/ProductImage";

import { usePostSearch } from "@/hooks/usePostSearch";
import { t } from "@/i18n/t";
import { formatPersianDate, toPersianNumber } from "@/utils/persian";

interface Props {
    searchQuery: string;
}

export default function BlogSearchPageView({ searchQuery }: Props) {
    const { results, loading, error, updateFilters } = usePostSearch({
        keyword: searchQuery,
        count: 12,
        paged: 1,
    });

    const handlePageChange = (page: number) => {
        updateFilters({ paged: page });
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
            <Breadcrumbs
                items={[
                    { label: t("nav.blog"), href: "/blog" },
                    { label: t("blog.search.breadcrumb", { q: searchQuery }) },
                ]}
            />

            <Box mb={4}>
                <UniversalSearchBar />
            </Box>

            <Typography variant="h5" mb={3}>
                {t("blog.search.resultsFor")}{" "}
                <KeywordHighlight text={searchQuery} keyword={searchQuery} />
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    ({toPersianNumber(results.pagination.total)} {t("blog.search.postCountLabel")})
                </Typography>
            </Typography>

            {error && (
                <Typography color="error" textAlign="center" mb={3}>
                    {t("blog.search.error", { error })}
                </Typography>
            )}

            {results.items.length === 0 ? (
                <Typography variant="body1" textAlign="center" py={8}>
                    {t("blog.search.noResults")}
                </Typography>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {results.items.map((post) => (
                            <Grid key={post.code} size={{ xs: 12, md: 6 }}>
                                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                    {/* Replaces CardMedia (UI image => ProductImage only) */}
                                    <Box sx={{ width: "100%", height: 200, overflow: "hidden" }}>
                                        <ProductImage
                                            entity={post}
                                            alt={post.title}
                                            size="800x450"
                                            quality={75}
                                            fallback="placeholder"
                                            noWrapper
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                            }}
                                        />
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="h6"
                                            component={Link}
                                            href={`/blog/${post.code}`}
                                            sx={{ textDecoration: "none", color: "inherit" }}
                                        >
                                            <KeywordHighlight text={post.title} keyword={searchQuery} />
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                                            <KeywordHighlight
                                                text={post.excerpt ?? post.description ?? ""}
                                                keyword={searchQuery}
                                            />
                                        </Typography>

                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" color="text.secondary">
                                                {formatPersianDate(post.created_at)}
                                            </Typography>

                                            <Chip label={t("blog.postChip")} size="small" variant="outlined" />
                                        </Box>
                                    </CardContent>
                                </Card>
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
        </Container>
    );
}