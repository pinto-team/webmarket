"use client";

import Link from "next/link";
import { Card, CardContent, Typography, Box } from "@mui/material";

import ProductImage from "@/components/common/ProductImage";
import { currency } from "@/lib";

interface ProductResource {
    code: string;
    title: string;
    excerpt?: string;
    price: number;

    // ✅ only proxy_url (canonical)
    upload?: { proxy_url?: string };
    proxy_url?: string;
}

interface ProductCardProps {
    product: ProductResource;
}

export default function ProductCard({ product }: ProductCardProps) {
    const excerpt = (product.excerpt || "").trim();

    return (
        <Link href={`/products/${product.code}`} style={{ textDecoration: "none", display: "block" }}>
            <Card
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 150ms ease",
                    "&:hover": { boxShadow: 6 },
                }}
            >
                {/* UI Image => ProductImage only */}
                <Box sx={{ width: "100%", height: 200, overflow: "hidden" }}>
                    <ProductImage
                        entity={product}
                        alt={product.title}
                        size="500x500"
                        quality={80}
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
                                WebkitBoxOrient: "vertical",
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