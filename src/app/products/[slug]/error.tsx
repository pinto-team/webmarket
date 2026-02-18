"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";
import { t } from "@/i18n/t";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <Container sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="h4" mb={2}>
                {t("errors.productLoadTitle")}
            </Typography>

            <Typography color="text.secondary" mb={4}>
                {t("errors.productLoadDescription")}
            </Typography>

            <Box display="flex" gap={2} justifyContent="center">
                <Button variant="contained" onClick={reset}>
                    {t("errors.tryAgain")}
                </Button>

                <Button variant="outlined" component={Link} href="/">
                    {t("errors.goHome")}
                </Button>
            </Box>
        </Container>
    );
}
