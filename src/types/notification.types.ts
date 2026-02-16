import { PaginatedResponse } from "./api.types";

// Notification resource
export interface NotificationResource {
  id: number;
  connectable_id: number;
  connectable_type: string;
  title: string;
  description: string;
  url: string;
  type: number;
  type_label: string;
  status: number;
  status_label: string;
  created_at: string;
  updated_at: string;
}

// Notification list request params
export interface NotificationListParams {
  paged?: number;
  count?: number;
}

// Notification update request
export interface NotificationUpdateRequest {
  status: number;
}

// Notification list response
export type NotificationListResponse = PaginatedResponse<NotificationResource>;
