"use client";

import Link from "next/link";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { getProductImageUrl } from "@/utils/imageUtils";
import { currency } from "@/lib";

interface ProductResource {
    code: string;
    title: string;
    excerpt?: string;
    price: number;
    upload?: {
        main_url: string;
        thumb_url?: string;
    };
}

interface ProductCardProps {
    product: ProductResource;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = getProductImageUrl(product);
    const excerpt = (product.excerpt || "").trim();

    return (
        <Link href={`/products/${product.code}`} style={{ textDecoration: "none", display: "block" }}>
            <Card
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 150ms ease",
                    "&:hover": { boxShadow: 6 }
                }}
            >
                <CardMedia
                    component="img"
                    height={200}
                    image={imageUrl}
                    alt={product.title}
                    loading="lazy"
                    sx={{ objectFit: "cover" }}
                />

                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="h6" gutterBottom noWrap title={product.title}>
                        {product.title}
                    </Typography>

                    {excerpt ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical"
                            }}
                        >
                            {excerpt}
                        </Typography>
                    ) : (
                        <Box sx={{ mb: 1 }} />
                    )}

                    <Box mt="auto" display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="primary">
                            {currency(product.price)}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
}
