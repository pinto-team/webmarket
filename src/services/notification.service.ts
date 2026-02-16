import axiosInstance from "@/utils/axiosInstance";
import { ApiResponse } from "@/types/api.types";
import {
  NotificationListResponse,
  NotificationListParams,
  NotificationUpdateRequest,
} from "@/types/notification.types";

/**
 * Get notifications list
 * GET /api/front/notifications
 */
export const getNotifications = async (
  params?: NotificationListParams
): Promise<NotificationListResponse> => {
  const response = await axiosInstance.get<ApiResponse<NotificationListResponse>>(
    "/notifications",
    { params }
  );
  return response.data.data;
};

/**
 * Update notification (mark as read)
 * PUT /api/front/notifications/{id}
 */
export const updateNotification = async (
  id: number,
  request: NotificationUpdateRequest
): Promise<boolean> => {
  const response = await axiosInstance.put<ApiResponse<boolean>>(
    `/notifications/${id}`,
    request
  );
  return response.data.data;
};
