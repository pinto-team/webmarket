// Base response wrapper for all API endpoints
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Error response structure
export interface ApiError {
  success: false;
  message: string;
  data?: ValidationError[];
}

// Validation error detail
export interface ValidationError {
  field: string;
  message: string;
}

// Paginated list response
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationResource;
}

// Pagination metadata
export interface PaginationResource {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
