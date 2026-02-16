import Shop from "./Shop.model";
import Review from "./Review.model";

interface Brand {
  title: string;
  code: string;
  description?: string;
  upload?: any;
}

export default interface Product {
  unit?: any;
  slug: string;
  price: number;
  title: string;
  rating: number;
  discount: number;
  thumbnail: string;
  description?: string;
  id: string;
  shop?: Shop;
  brands?: Brand[];
  size?: string[];
  status?: string;
  colors?: string[];
  images: string[];
  categories: any[];
  reviews?: Review[];
  published?: boolean;
}
