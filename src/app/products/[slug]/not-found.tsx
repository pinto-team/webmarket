import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { t } from "@/i18n/t";

export default function ProductNotFound() {
    return (
        <Container sx={{ py: 8, textAlign: "center" }}>
            <Box sx={{ maxWidth: 600, mx: "auto" }}>
                <Typography
                    variant="h1"
                    sx={{ fontSize: "6rem", fontWeight: 700, color: "primary.main", mb: 2 }}
                >
                    404
                </Typography>

                <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                    {t("product.notFound.title")}
                </Typography>

                <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
                    {t("product.notFound.description")}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        variant="contained"
                        component={Link}
                        href="/products"
                        size="large"
                    >
                        {t("product.notFound.viewAll")}
                    </Button>

                    <Button
                        variant="outlined"
                        component={Link}
                        href="/"
                        size="large"
                    >
                        {t("product.notFound.goHome")}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
