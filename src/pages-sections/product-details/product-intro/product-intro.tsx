import Link from "next/link";
// MUI
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import StorefrontIcon from "@mui/icons-material/Storefront";

// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import ProductGallery from "./product-gallery";
import ProductVariantSelector from "./product-variant-selector";

// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

// STYLED COMPONENTS
import { StyledRoot } from "./styles";

// TYPES
import { ProductResource, SkuResource } from "@/types/product.types";
import { VariantGroup } from "@/utils/product";

// UTILS
import { calculateAverageRating, getStockStatus, getMinPrice, groupSkusByShop } from "@/utils/product";
import { t } from "@/i18n/t";
import { toPersianNumber } from "@/utils/persian";

// ================================================================
type Props = {
    product: ProductResource;
    selectedSku: SkuResource | null;
    variantGroups: VariantGroup[];
    selectedVariants: Record<string, string>;
    onVariantSelect: (attribute: string, value: string) => void;
    isVariantAvailable: (attribute: string, value: string) => boolean;
};
// ================================================================

function stockKey(stockStatus: string) {
    if (stockStatus === "inStock") return "products.inStock";
    if (stockStatus === "outOfStock") return "products.outOfStock";
    if (stockStatus === "lowStock") return "products.lowStock";

    return "products.outOfStock";
}

export default function ProductIntro({
                                         product,
                                         selectedSku,
                                         variantGroups,
                                         selectedVariants,
                                         onVariantSelect,
                                         isVariantAvailable,
                                     }: Props) {
    const averageRating = calculateAverageRating(product.comments);
    const images = [product.upload, ...(product.attaches || [])];

    const effectiveSku = selectedSku || product.skus[0] || null;

    const displayPrice = effectiveSku?.price || getMinPrice(product.skus) || 0;
    const stock = effectiveSku ? effectiveSku.stock : product.skus.reduce((sum, sku) => sum + sku.stock, 0);
    const status = getStockStatus(stock);

    const shopGroups = groupSkusByShop(product.skus);
    const firstShop = shopGroups[0];
    const hasMultipleShops = shopGroups.length > 1;

    const scrollToSellers = () => {
        document.getElementById("sellers-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <StyledRoot>
            <Grid container spacing={3}>
                {/* IMAGE GALLERY AREA */}
                <Grid size={{ lg: 6, md: 6, xs: 12 }}>
                    <ProductGallery images={images} />
                </Grid>

                <Grid size={{ lg: 6, md: 6, xs: 12 }}>
                    <Typography variant="h1" sx={{ mb: 2.5 }}>
                        {product.title}
                    </Typography>

                    {/* CATEGORY */}
                    {product.categories[0] && (
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                            {t("nav.categories")}
                            {t("common.dash")}{" "}
                            <Link href={`/category/${product.categories[0].slug}`} style={{ textDecoration: "none" }}>
                                <strong style={{ color: "inherit", cursor: "pointer", textDecoration: "underline" }}>
                                    {product.categories[0].name}
                                </strong>
                            </Link>
                        </Typography>
                    )}

                    {/* PRODUCT BRAND */}
                    {product.brands[0] && (
                        <Typography variant="body1" sx={{ mb: 1.5 }}>
                            {t("nav.brands")}
                            {t("common.dash")}{" "}
                            <Link href={`/brand/${product.brands[0].code}`} style={{ textDecoration: "none" }}>
                                <strong style={{ color: "inherit", cursor: "pointer", textDecoration: "underline" }}>
                                    {product.brands[0].title}
                                </strong>
                            </Link>
                        </Typography>
                    )}

                    {/* PRODUCT CODE */}
                    <Typography variant="body1" sx={{ mb: 2.5 }}>
                        {t("productDetail.productCode")}
                        {t("common.dash")} <strong>{product.code}</strong>
                    </Typography>

                    {/* PRODUCT RATING */}
                    <div className="rating" style={{ marginBottom: "20px" }}>
                        <span>{t("productDetail.rated")}{t("common.dash")}</span>
                        <Rating readOnly color="warn" size="small" value={averageRating} />
                        <Typography variant="h6">
                            ({toPersianNumber(product.comments?.length || 0)})
                        </Typography>
                    </div>

                    {/* SELLER INFO */}
                    {firstShop && (
                        <Card sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <StorefrontIcon fontSize="small" color="action" />
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {firstShop.shop.title}
                                </Typography>
                            </Box>

                            {hasMultipleShops && (
                                <Button size="small" onClick={scrollToSellers} sx={{ mt: 1, textTransform: "none" }}>
                                    {t("common.view")} {toPersianNumber(shopGroups.length - 1)} {t("productDetail.allSellers")}
                                </Button>
                            )}
                        </Card>
                    )}

                    {/* PRODUCT VARIANTS */}
                    <ProductVariantSelector
                        variantGroups={variantGroups}
                        selectedVariants={selectedVariants}
                        onVariantSelect={onVariantSelect}
                        isVariantAvailable={isVariantAvailable}
                    />

                    {/* STOCK STATUS */}
                    <Typography variant="body2" color={stock > 0 ? "success.main" : "error.main"} sx={{ mb: 2 }}>
                        {t(stockKey(status))}
                    </Typography>

                    {/* PRICE */}
                    <Typography variant="h3" color="primary.main" sx={{ mb: 3 }}>
                        {currency(displayPrice)}
                    </Typography>

                    {/* ADD TO CART BUTTON */}
                    <AddToCart selectedSku={effectiveSku} productCode={product.code} />
                </Grid>
            </Grid>
        </StyledRoot>
    );
}
