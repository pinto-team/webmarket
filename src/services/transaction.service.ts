import axiosInstance from "@/utils/axiosInstance";
import { ApiResponse } from "@/types/api.types";
import {
  TransactionListResponse,
  TransactionListParams,
} from "@/types/transaction.types";

/**
 * Get transactions list
 * GET /api/front/transactions
 */
export const getTransactions = async (
  params?: TransactionListParams
): Promise<TransactionListResponse> => {
  const response = await axiosInstance.get<ApiResponse<TransactionListResponse>>(
    "/transactions",
    { params }
  );
  return response.data.data;
};
