import type { AxiosInstance } from "axios";

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
import axiosInstance from "@/utils/axiosInstance";

export const contentService = {
  async getPosts(params?: PostListParams, api: AxiosInstance = axiosInstance): Promise<PaginatedResponse<PostResource>> {
    const response = await api.get<ApiResponse<PaginatedResponse<PostResource>>>("/posts", { params });
    return response.data.data;
  },

  async getPost(code: string, api: AxiosInstance = axiosInstance): Promise<PostResource> {
    const response = await api.get<ApiResponse<PostResource>>(`/posts/${code}`);
    return response.data.data;
  },

  async getFaqs(api: AxiosInstance = axiosInstance): Promise<FaqResource[]> {
    const response = await api.get<ApiResponse<FaqResource[]>>("/faqs");
    return response.data.data;
  },

  async getPage(code: string, api: AxiosInstance = axiosInstance): Promise<PageResource> {
    const response = await api.get<ApiResponse<PageResource>>(`/pages/${code}`);
    return response.data.data;
  },

  async getPostCategories(parent_id?: number, api: AxiosInstance = axiosInstance): Promise<PostCategoryResource[]> {
    const response = await api.get<ApiResponse<PostCategoryResource[]>>("/post-cats", {
      params: parent_id ? { parent_id } : undefined,
    });
    return response.data.data;
  },

  async getPostCategory(code: string, params?: PostListParams, api: AxiosInstance = axiosInstance): Promise<CategoryWithPosts> {
    const response = await api.get<ApiResponse<CategoryWithPosts>>(`/post-cats/${code}`, { params });
    return response.data.data;
  },

  async getPostTags(api: AxiosInstance = axiosInstance): Promise<PostTagResource[]> {
    const response = await api.get<ApiResponse<PostTagResource[]>>("/post-tags");
    return response.data.data;
  },

  async getPostTag(code: string, params?: PostListParams, api: AxiosInstance = axiosInstance): Promise<TagWithPosts> {
    const response = await api.get<ApiResponse<TagWithPosts>>(`/post-tags/${code}`, { params });
    return response.data.data;
  },

  async getRules(api: AxiosInstance = axiosInstance): Promise<string> {
    const response = await api.get<ApiResponse<string>>("/rules");
    return response.data.data;
  }
};
