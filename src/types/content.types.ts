import { ImageResource } from "./product.types";
import { PaginatedResponse } from "./api.types";

export interface PostResource {
  code: string;
  title: string;
  description: string;
  excerpt: string;
  upload: ImageResource;
  created_at: string;
  slug?: string;
  total_views?: number;
}

export interface FaqResource {
  title: string;
  description: string;
}

export interface PageResource {
  code: string;
  title: string;
  description: string;
}

// Post category resource
export interface PostCategoryResource {
  name: string;
  description: string;
  slug: string;
  parent_id: number | null;
  image?: ImageResource;
}

// Post tag resource
export interface PostTagResource {
  name: string;
  slug: string;
}

// Category with posts
export interface CategoryWithPosts {
  category: PostCategoryResource;
  posts: PaginatedResponse<PostResource>;
}

// Tag with posts
export interface TagWithPosts {
  tag: PostTagResource;
  posts: PaginatedResponse<PostResource>;
}

// Post list params
export interface PostListParams {
  sort?: "most_visited" | "oldest" | "new";
  keyword?: string;
  count?: number;
  paged?: number;
}

export type PostSort = "most_visited" | "oldest" | "new";
