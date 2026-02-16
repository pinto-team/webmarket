import axiosInstance from '@/utils/axiosInstance';
import { ApiResponse } from '@/types/api.types';
import { GatewayResource } from '@/types/gateway.types';
import { AvailableGatewaysResponse } from '@/types/payment.types';

export const getGateways = async (): Promise<GatewayResource[]> => {
  const response = await axiosInstance.get<ApiResponse<GatewayResource[]>>('/gateways');
  return response.data.data;
};

export const getAvailableGateways = async (): Promise<AvailableGatewaysResponse> => {
  const response = await axiosInstance.get<ApiResponse<AvailableGatewaysResponse>>('/gateways');
  return response.data.data;
};
