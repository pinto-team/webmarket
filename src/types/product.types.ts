export interface Product {
  id: number;
  code: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number;
  stock: number;
  images: ProductImage[];
  category?: Category;
  brand?: Brand;
  attributes?: ProductAttribute[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt?: string;
  order: number;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  parent_id?: number;
  image?: string;
}

export interface Brand {
  id: number;
  title: string;
  slug: string;
  logo?: string;
}

export interface ProductAttribute {
  id: number;
  key: string;
  value: string;
}

export interface ProductFilters {
  category_id?: number;
  brand?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  per_page?: number;
  sort?: "most_visited" | "best_sale" | "highest" | "lowest" | "modify" | "oldest" | "new";
  keyword?: string;
  paged?: number;
  count?: number;
}

export interface BrandWithProducts {
  brand: BrandResource;
  products: { items: ProductResource[]; pagination: any };
}

export interface CategoryWithProducts {
  category: CategoryResource;
  products: { items: ProductResource[]; pagination: any };
}

export interface TagWithProducts {
  tag: TagResource;
  products: { items: ProductResource[]; pagination: any };
}

// Product resource (full details) - matches Taavoni API
export interface ProductResource {
  shop: ShopResource;
  upload: ImageResource;
  code: string;
  title: string;
  description: string;
  excerpt: string;
  weight: number;
  unit: number;
  unit_label: string;
  type: number;
  type_label: string;
  price: number;
  total_views: number;
  total_sales: number;
  brands: BrandResource[];
  categories: CategoryResource[];
  tags: TagResource[];
  skus: SkuResource[];
  attaches?: ImageResource[];
  comments?: CommentResource[];
}

export interface SkuResource {
  id: number;
  shop: ShopResource;
  warehouse: WarehouseResource;
  upload?: ImageResource;
  guarantee?: GuaranteeResource;
  product?: {
    id: number;
    code: string;
    title: string;
    upload?: ImageResource;
    weight?: string;
    unit?: number;
    unit_label?: string;
    type?: number;
    type_label?: string;
  };
  title: string;
  code: string;
  price: number;
  stock: number;
  delivery: number;
  variants: VariantResource[];
  product_code?: string;
}

export interface VariantResource {
  attribute: AttributeResource;
  attribute_value: AttributeValueResource;
}

export interface AttributeResource {
  title: string;
}

export interface AttributeValueResource {
  title: string;
  value: string;
}

export interface BrandResource {
  title: string;
  description?: string;
  code: string;
  upload?: ImageResource;
}

export interface CategoryResource {
  id: number;
  name: string;
  title?: string;
  description?: string;
  slug: string;
  code: string;
  parent_id?: number;
  upload?: ImageResource;
  parent?: CategoryResource;
  children?: CategoryResource[];
}

export interface TagResource {
  title: string;
  code: string;
}

export interface WarehouseResource {
  title: string;
  code: string;
  description: string;
}

export interface GuaranteeResource {
  title: string;
  company: string;
  duration: number;
}

export interface ImageResource {
  main_url: string;
  thumb_url?: string;
  title?: string;
  extension?: string;
  class?: string;
  priority?: number;
}

export interface ShopResource {
  title: string;
  upload: ImageResource;
  theme: ThemeResource;
  region: RegionResource;
  metas: MetaResource[];
}

export interface ThemeResource {
  title: string;
  code: string;
}

export interface RegionResource {
  title: string;
  code: string;
  parent?: RegionResource;
  children?: RegionResource[];
}

export interface MetaResource {
  key: string;
  value: string;
  class: string;
}

export interface CommentResource {
  id: number;
  title: string;
  description: string;
  rating: number;
  created_at: string;
  ownerable: any;
  replies: CommentResource[];
}

export interface CartItemResource {
  id: number;
  temp_id: string;
  sku: SkuResource;
  quantity: number;
  product?: { code: string };
}
