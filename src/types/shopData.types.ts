import { ImageResource } from "./product.types";

export interface ShopDataResponse {
  success: boolean;
  message: string;
  data: ShopData;
}

export interface ShopData {
    title: string;
    theme: ThemeConfig;
    topbar: TopbarConfig;
    header_logo: ImageResource;
    footer_logo: ImageResource;
    mobile_logo: ImageResource;
    main_navigation: MenuItem[];
    hero_slider: HeroSlide[];
    product_categories: ProductCategory[];
    faqs: FAQ[];
    blog_posts: BlogPost[];
    footer_description: string;
    app_links: AppLinks;
    footer_sections: FooterSection[];
    contact_info: ContactInfo;
    social_links: SocialLink[];
    footer_copyright: string;
    home_banner?: HomeBanner;
}

export interface HomeBanner {
    image: ImageResource;
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
}

export interface ThemeConfig {
  title: string;
  code: string;
}

export interface TopbarConfig {
  label: string;
  title: string;
  link: string;
  is_active: boolean;
}

export interface MenuItem {
  title: string;
  url: string;
  children: MenuItem[];
}

export interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image_desktop: ImageResource;
  image_mobile: ImageResource;
  button_text: string;
  button_link: string;
  background_color: string;
  text_color: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
  parent_id: number | null;
  parent: ProductCategory | null;
  children: ProductCategory[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  image: ImageResource;
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  total_views: number;
  commenting: number;
  commenting_label: string;
  categories: BlogCategory[];
  created_at: string;
}

export interface BlogCategory {
  name: string;
  description: string;
  slug: string;
}



export interface AppLinks {
  google_play: string;
  app_store: string;
  direct_download: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  title: string;
  url: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ShopResource {
  id: number;
  name: string;
  slug: string;
  logo: string;
  cover: string | null;
  is_active: boolean;
}
