import axiosInstance from "@/utils/axiosInstance";
import { createSSRAxiosInstance } from "@/utils/axiosSSR";
import { ApiResponse, PaginatedResponse } from "@/types/api.types";
import {
  PostResource,
  FaqResource,
  PageResource,
  PostCategoryResource,
  PostTagResource,
  CategoryWithPosts,
  TagWithPosts,
  PostListParams,
} from "@/types/content.types";

export const contentService = {
  async getPosts(params?: PostListParams): Promise<PaginatedResponse<PostResource>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<PostResource>>>("/posts", { params });
    return response.data.data;
  },

  async getPost(code: string, origin?: string): Promise<PostResource> {
    const axios = origin ? createSSRAxiosInstance(origin) : axiosInstance;
    const response = await axios.get<ApiResponse<PostResource>>(`/posts/${code}`);
    return response.data.data;
  },

  async getFaqs(): Promise<FaqResource[]> {
    const response = await axiosInstance.get<ApiResponse<FaqResource[]>>("/faqs");
    return response.data.data;
  },

  async getPage(code: string, origin?: string): Promise<PageResource> {
    const axios = origin ? createSSRAxiosInstance(origin) : axiosInstance;
    const response = await axios.get<ApiResponse<PageResource>>(`/pages/${code}`);
    return response.data.data;
  },

  async getPostCategories(parent_id?: number): Promise<PostCategoryResource[]> {
    const response = await axiosInstance.get<ApiResponse<PostCategoryResource[]>>("/post-cats", {
      params: parent_id ? { parent_id } : undefined,
    });
    return response.data.data;
  },

  async getPostCategory(code: string, params?: PostListParams): Promise<CategoryWithPosts> {
    const response = await axiosInstance.get<ApiResponse<CategoryWithPosts>>(`/post-cats/${code}`, { params });
    return response.data.data;
  },

  async getPostTags(): Promise<PostTagResource[]> {
    const response = await axiosInstance.get<ApiResponse<PostTagResource[]>>("/post-tags");
    return response.data.data;
  },

  async getPostTag(code: string, params?: PostListParams): Promise<TagWithPosts> {
    const response = await axiosInstance.get<ApiResponse<TagWithPosts>>(`/post-tags/${code}`, { params });
    return response.data.data;
  },

  async getRules(): Promise<string> {
    const response = await axiosInstance.get<ApiResponse<string>>("/rules");
    return response.data.data;
  }
};
