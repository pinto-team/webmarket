import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Divider from "@mui/material/Divider";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { contentService } from "@/services/content.service";
import { getOrigin } from "@/utils/getOrigin";
import { tServer } from "@/i18n/serverT";
import { formatPersianDate, toPersianNumber } from "@/utils/persian";

interface PageProps {
    params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { code } = await params;
    const origin = await getOrigin();

    try {
        const post = await contentService.getPost(code, origin);

        const blogTitle = tServer<string>("nav.blog");
        const notFoundTitle = tServer<string>("blog.post.notFoundTitle");

        const title = post?.title ? `${post.title} | ${blogTitle}` : notFoundTitle;

        return {
            title,
            description: post.excerpt,
            openGraph: {
                title: post.title,
                description: post.excerpt,
                images: post.upload?.main_url ? [{ url: post.upload.main_url }] : [],
                type: "article",
            },
        };
    } catch {
        return { title: tServer<string>("blog.post.notFoundTitle") };
    }
}

export default async function BlogPostPage({ params }: PageProps) {
    const { code } = await params;
    const origin = await getOrigin();

    try {
        const post = await contentService.getPost(code, origin);

        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Breadcrumbs sx={{ mb: 3 }}>
                    <Link href="/">{tServer("nav.home")}</Link>
                    <Link href="/blog">{tServer("nav.blog")}</Link>
                    <Typography color="text.primary">{post.title}</Typography>
                </Breadcrumbs>

                <Box sx={{ maxWidth: 900, mx: "auto" }}>
                    {post.upload?.main_url && (
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: { xs: 250, sm: 350, md: 450 },
                                borderRadius: 2,
                                overflow: "hidden",
                                mb: 4,
                            }}
                        >
                            <Image
                                src={post.upload.main_url}
                                alt={post.title}
                                fill
                                style={{ objectFit: "cover" }}
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                            />
                        </Box>
                    )}

                    <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
                        {post.title}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 3, mb: 3, color: "text.secondary", flexWrap: "wrap" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <CalendarTodayIcon fontSize="small" />
                            <Typography variant="body2">{formatPersianDate(post.created_at)}</Typography>
                        </Box>

                        {post.total_views != null && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <VisibilityIcon fontSize="small" />
                                <Typography variant="body2">
                                    {toPersianNumber(post.total_views)} {tServer("blog.post.views")}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {post.excerpt && (
                        <Typography
                            variant="h6"
                            sx={{ mb: 3, color: "text.secondary", fontWeight: 400, lineHeight: 1.8 }}
                        >
                            {post.excerpt}
                        </Typography>
                    )}

                    <Divider sx={{ my: 4 }} />

                    <Box
                        sx={{
                            "& img": { maxWidth: "100%", height: "auto", borderRadius: 2, my: 2 },
                            "& p": { mb: 2, lineHeight: 1.9, fontSize: "1.05rem" },
                            "& h1, & h2, & h3, & h4, & h5, & h6": { mt: 3, mb: 2, fontWeight: 600 },
                            "& ul, & ol": { pr: 3, mb: 2 },
                            "& li": { mb: 1 },
                            "& a": { color: "primary.main", textDecoration: "underline" },
                            "& blockquote": {
                                borderRight: 4,
                                borderColor: "primary.main",
                                pr: 2,
                                py: 1,
                                my: 2,
                                bgcolor: "grey.50",
                            },
                            "& code": { bgcolor: "grey.100", px: 1, py: 0.5, borderRadius: 1, fontSize: "0.9em" },
                            "& pre": { bgcolor: "grey.900", color: "white", p: 2, borderRadius: 2, overflow: "auto", my: 2 },
                        }}
                        dangerouslySetInnerHTML={{ __html: post.description }}
                    />
                </Box>
            </Container>
        );
    } catch {
        notFound();
    }
}
