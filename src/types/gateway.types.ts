import { ImageResource } from './product.types';

export enum PaymentStatusEnum {
  PENDING = 0,
  PAID = 1,
  FAILED = 2,
  CANCELLED = 3,
  REFUNDED = 4,
}

export type GatewayType = 'platform' | 'shop';

export interface GatewayResource {
  id: number;
  title: string;
  code: string;
  type: number;
  logo: string | null;
  is_shop_specific: boolean;
}

export interface PaymentGatewayResponse {
  gateway_type: GatewayType;
  gateways: GatewayResource[];
  requires_shop_gateway: boolean;
}

export interface PaymentResource {
  id: number;
  shop_gateway: GatewayResource | null;
  status: PaymentStatusEnum;
  status_label: string;
  amount: number;
  response: string | null;
  created_at: string;
}
