import { GatewayResource } from "./gateway.types";

// Payment Gateway Request
export interface PaymentGatewayRequest {
  gateway_id?: number;
  shop_gateway_id?: number;
  cargo_methods: CargoMethodSelection[];
}

// Cargo Method Selection
export interface CargoMethodSelection {
  shipment_id: number;
  shop_cargo_method_id: number;
}

// Payment Gateway Response
export interface PaymentGatewayResponse {
  payment_url: string;
  order_id: number;
  order_code: string;
}

// Available Gateways Response
export interface AvailableGatewaysResponse {
  gateway_type: string;
  gateways: GatewayResource[];
  requires_shop_gateway: boolean;
}
