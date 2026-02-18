"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import { contentService } from "@/services/content.service";
import { PostTagResource } from "@/types/content.types";
import { t } from "@/i18n/t";

export default function TagCloud() {
    const [tags, setTags] = useState<PostTagResource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await contentService.getPostTags();
                setTags(data);
            } catch (error) {
                console.error(t("blog.tag.fetchError"), error);
            } finally {
                setLoading(false);
            }
        };
        fetchTags();
    }, []);

    if (loading) return null;
    if (tags.length === 0) return null;

    return (
        <Box>
            <Typography variant="h6" mb={2}>
                {t("blog.tag.cloudTitle")}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1}>
                {tags.map((tag) => (
                    <Link key={tag.slug} href={`/blog/tag/${tag.slug}`}>
                        <Chip label={tag.name} clickable />
                    </Link>
                ))}
            </Box>
        </Box>
    );
}
