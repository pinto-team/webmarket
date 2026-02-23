"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "components/Container";
import { ReactNode } from "react";

interface EmptyPageProps {
    title?: string;
    description?: string;
    actionText?: string;
    onActionClick?: () => void;
    icon?: ReactNode;
}

export default function EmptyPage({
                                      title = "محتوایی برای نمایش وجود ندارد",
                                      description = "در حال حاضر داده‌ای در این بخش ثبت نشده است.",
                                      actionText,
                                      onActionClick,
                                      icon,
                                  }: EmptyPageProps) {
    return (
        <Container>
            <Box
                sx={{
                    minHeight: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    flexDirection: "column",
                    py: 8,
                }}
            >
                {icon && (
                    <Box sx={{ mb: 3, opacity: 0.6 }}>
                        {icon}
                    </Box>
                )}

                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {title}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{ mb: 3, maxWidth: 500, opacity: 0.7 }}
                >
                    {description}
                </Typography>

                {actionText && onActionClick && (
                    <Button variant="contained" onClick={onActionClick}>
                        {actionText}
                    </Button>
                )}
            </Box>
        </Container>
    );
}