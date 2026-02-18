"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { t } from "@/i18n/t";

export default function ShopErrorPage() {
    const router = useRouter();

    const handleRetry = () => {
        router.push("/");
        router.refresh();
    };

    return (
        <Container>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
                textAlign="center"
                gap={3}
            >
                <Typography variant="h3" color="error">
                    {t("errors.general")}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    {t("errors.network")}
                </Typography>

                <Button variant="contained" size="large" onClick={handleRetry}>
                    {t("common.retry")}
                </Button>
            </Box>
        </Container>
    );
}
