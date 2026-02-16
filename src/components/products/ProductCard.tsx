import Link from 'next/link';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { getProductImageUrl } from '@/utils/imageUtils';

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
  return (
    <Link href={`/products/${product.code}`} style={{ textDecoration: 'none' }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 6 } }}>
        <CardMedia
          component="img"
          height="200"
          image={getProductImageUrl(product)}
          alt={product.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom noWrap>
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.excerpt}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="primary">
              {product.price.toLocaleString('fa-IR')} تومان
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
