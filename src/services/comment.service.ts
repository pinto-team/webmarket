import axiosInstance from "@/utils/axiosInstance";
import { ApiResponse } from "@/types/api.types";

export interface AddCommentRequest {
  product_code: string;
  body: string;
  rate: number; // 1-5
}

export const commentService = {
  async addComment(data: AddCommentRequest): Promise<number> {
    const response = await axiosInstance.post<ApiResponse<number>>("/api/front/comments", data);
    return response.data.data;
  }
};
