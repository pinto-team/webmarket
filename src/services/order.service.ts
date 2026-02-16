import axiosInstance from "@/utils/axiosInstance";
import type { ApiResponse } from "@/types/api.types";
import type {
  OrderResource,
  OrderCreateRequest,
  OrderUpdateRequest,
  PaymentInitiationResponse,
  OrderNoteCreateRequest,
  OrderListParams
} from "@/types/order.types";

export interface OrderCollection {
  items: OrderResource[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const orderService = {
  async getOrders(params: OrderListParams = {}): Promise<OrderCollection> {
    const response = await axiosInstance.get<ApiResponse<OrderCollection>>("/orders", { params });
    return response.data.data;
  },

  async getOrder(idOrCode: string | number): Promise<OrderResource> {
    const response = await axiosInstance.get<ApiResponse<OrderResource>>(`/orders/${idOrCode}`);
    return response.data.data;
  },

  async createOrder(data: OrderCreateRequest): Promise<OrderResource> {
    const response = await axiosInstance.post<ApiResponse<OrderResource>>("/orders", data);
    return response.data.data;
  },

  async requestPaymentGateway(orderId: number, data: OrderUpdateRequest): Promise<PaymentInitiationResponse> {
    const response = await axiosInstance.put<ApiResponse<PaymentInitiationResponse>>(`/orders/${orderId}`, data);
    return response.data.data;
  },

  async createOrderNote(data: OrderNoteCreateRequest): Promise<{ id: number }> {
    const response = await axiosInstance.post<ApiResponse<{ id: number }>>("/order-notes", data);
    return response.data.data;
  }
};
