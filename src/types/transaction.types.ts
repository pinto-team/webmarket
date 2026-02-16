import { PaginatedResponse } from "./api.types";

// Transaction resource
export interface TransactionResource {
  id: number;
  price: number;
  status: number;
  status_label: string;
  type: number;
  type_label: string;
  description: string;
  calculated: boolean;
  created_at: string;
}

// Transaction list request params
export interface TransactionListParams {
  type?: number;
  starts_at?: string;
  ends_at?: string;
  count?: number;
  paged?: number;
}

// Transaction list response
export type TransactionListResponse = PaginatedResponse<TransactionResource>;
