import { cache } from "react";
// CUSTOM DATA MODEL
import { SlugParams } from "models/Common";
import Product from "models/Product.model";

// get all product slug
const getSlugs = cache(async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/products/slug-list`);
  return response.json();
});

// get product based on slug
const getProduct = cache(async (slug: string) => {
  try {
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer 
      ? 'https://api.taavoni.online/api/front'
      : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000');
    
    const url = isServer 
      ? `${baseUrl}/products/${slug}`
      : `${baseUrl}/api/proxy/products/${slug}`;
    
    const options: RequestInit = { cache: 'no-store' };
    if (isServer) {
      options.headers = {
        'Authorization': 'Basic ' + Buffer.from('test:1qaz2wsx').toString('base64')
      };
    }
    
    const response = await fetch(url, options);
    if (!response.ok) return null;
    const data = await response.json();
    if (data?.success === false) return null;
    const product = data?.data || data;
    
    // Transform API response to match Product model
    if (product && product.attaches) {
      product.images = product.attaches.map((attach: any) => attach.main_url);
    }
    
    return product;
  } catch (error) {
    return null;
  }
});

// search products
const searchProducts = cache(async (name?: string, category?: string) => {
  try {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (category) params.append('category', category);
    
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer 
      ? 'https://api.taavoni.online/api/front'
      : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000');
    
    const url = isServer 
      ? `${baseUrl}/products/search?${params}`
      : `${baseUrl}/api/products/search?${params}`;
    
    const options: RequestInit = {};
    if (isServer) {
      options.headers = {
        'Authorization': 'Basic ' + Buffer.from('test:1qaz2wsx').toString('base64')
      };
    }
    
    const response = await fetch(url, options);
    return response.json();
  } catch (error) {
    return [];
  }
});

interface ProductReview {
  name: string;
  date: string;
  imgUrl: string;
  rating: number;
  comment: string;
}

// product reviews
const getProductReviews = cache(async () => {
  try {
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer 
      ? 'https://api.taavoni.online/api/front'
      : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000');
    
    const url = isServer 
      ? `${baseUrl}/product/reviews`
      : `${baseUrl}/api/product/reviews`;
    
    const options: RequestInit = {};
    if (isServer) {
      options.headers = {
        'Authorization': 'Basic ' + Buffer.from('test:1qaz2wsx').toString('base64')
      };
    }
    
    const response = await fetch(url, options);
    return response.json();
  } catch (error) {
    return [];
  }
});

export default { getSlugs, getProduct, searchProducts, getProductReviews };
