/**
 * Get the optimal product image URL with size parameter
 * Priority: proxy_url -> thumb_url -> main_url -> placeholder
 */
export const getProductImageUrl = (product: any, size?: string): string => {
  if (!product) return '/placeholder.png';
  
  let baseUrl = '';
  let useProxy = false;
  
  // Check if product has upload object
  if (product?.upload?.proxy_url) {
    baseUrl = product.upload.proxy_url;
    useProxy = true;
  } else if (product?.upload?.thumb_url) {
    baseUrl = product.upload.thumb_url;
  } else if (product?.upload?.main_url) {
    baseUrl = product.upload.main_url;
  }
  // Check if product has direct URLs (for ImageResource)
  else if (product?.proxy_url) {
    baseUrl = product.proxy_url;
    useProxy = true;
  } else if (product?.thumb_url) {
    baseUrl = product.thumb_url;
  } else if (product?.main_url) {
    baseUrl = product.main_url;
  }
  // Check for thumbnail property (legacy)
  else if (product?.thumbnail) {
    baseUrl = product.thumbnail;
  }
  
  if (!baseUrl) return '/placeholder.png';
  
  // If using proxy_url, replace placeholders
  if (useProxy && baseUrl.includes('{WIDTH}')) {
    const [width, height] = size ? size.split('x').map(Number) : [800, 800];
    const quality = 80;
    
    baseUrl = baseUrl
      .replace('{WIDTH}', width.toString())
      .replace('{HEIGHT}', height.toString())
      .replace('{QUALITY}', quality.toString());
  }
  // For non-proxy URLs from box.taavoni.online, add size parameter
  else if (size && baseUrl.includes('box.taavoni.online')) {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}size=${size}`;
  }
  
  return baseUrl;
};

/**
 * Get product image URL for specific contexts with appropriate sizes
 */
export const getProductImageUrls = {
  thumbnail: (product: any) => getProductImageUrl(product, '150x150'),
  small: (product: any) => getProductImageUrl(product, '300x300'),
  medium: (product: any) => getProductImageUrl(product, '500x500'),
  large: (product: any) => getProductImageUrl(product, '800x800'),
  original: (product: any) => getProductImageUrl(product),
};