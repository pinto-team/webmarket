import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function ProductNotFound() {
  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: 700, color: "primary.main", mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          محصول یافت نشد
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
          متأسفانه محصول مورد نظر شما یافت نشد. ممکن است حذف شده یا آدرس اشتباه باشد.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="contained" component={Link} href="/products" size="large">
            مشاهده همه محصولات
          </Button>
          <Button variant="outlined" component={Link} href="/" size="large">
            بازگشت به خانه
          </Button>
        </Box>
      </Box>
    </Container>
  );
}