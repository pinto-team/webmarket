import axiosInstance from "@/utils/axiosInstance";
import { ApiResponse } from "@/types/api.types";
import { TicketResource, TicketCreateRequest } from "@/types/ticket.types";

/**
 * Get active support ticket
 * GET /api/front/tickets
 */
export const getActiveTicket = async (): Promise<TicketResource | null> => {
  const response = await axiosInstance.get<ApiResponse<TicketResource | null>>(
    "/tickets"
  );
  return response.data.data;
};

/**
 * Create new ticket or reply to existing one
 * POST /api/front/tickets
 */
export const createTicket = async (
  request: TicketCreateRequest
): Promise<number> => {
  const response = await axiosInstance.post<ApiResponse<number>>(
    "/tickets",
    request
  );
  return response.data.data;
};
