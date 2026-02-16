import { AddressResource } from "./address.types";
import { SkuResource, ShopResource, WarehouseResource } from "./product.types";
import { GatewayResource } from "./gateway.types";

// Order Resource - matches Taavoni API
export interface OrderResource {
  id: number;
  code: string;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  customer_address: AddressResource;
  status: number;
  status_label: string;
  cargo_price: number;
  off_price: number;
  paid_price: number;
  total_price: number;
  coupon_code: string | null;
  payments: PaymentResource[];
  shipments: ShipmentResource[];
  notes: OrderNoteResource[];
  created_at: string;
  gateway_type?: string;
  gateways?: GatewayResource[];
  requires_shop_gateway?: boolean;
}

// Shipment Resource
export interface ShipmentResource {
  id: number;
  shop: ShopResource;
  warehouse: WarehouseResource | null;
  code: string;
  type: number;
  type_label: string;
  status: number;
  status_label: string;
  weight: string;
  price: number;
  tracking_code: string | null;
  items: ShipmentItemResource[];
  stops: any[];
  created_at: string;
  available_cargo_methods?: CargoMethodResource[];
}

// Shipment Item Resource
export interface ShipmentItemResource {
  id: number;
  sku: SkuResource;
  quantity: number;
  weight: string;
  unit: number;
  unit_label: string;
  price: number;
  sku_data: SkuDataResource;
  created_at: string;
}

// SKU Data Resource
export interface SkuDataResource {
  id: number;
  title: string;
  code: string;
  price: number;
  stock: number;
  delivery: number;
  type: number;
  type_label: string;
}

// Cargo Method Resource
export interface CargoMethodResource {
  id: number;
  title: string;
  base_price: string;
  per_kg_rate: string;
  min_weight: number;
  max_weight: string;
  free_over: number;
}

// Payment Resource
export interface PaymentResource {
  id: number;
  status: number;
  status_label: string;
  amount: number;
  created_at: string;
}

// Order Note Resource
export interface OrderNoteResource {
  id: number;
  type: number;
  description: string;
  created_at: string;
}

// Order Create Request
export interface OrderCreateRequest {
  address_id?: number;
  customer_name: string;
  customer_mobile: string;
  customer_email?: string;
}

// Order Create Response - returns only order_id
export interface OrderCreateResponse {
  id: number;
}
// Order Update Request
export interface OrderUpdateRequest {
  cargo_methods: CargoMethodSelection[];
  gateway_id?: number;
  shop_gateway_id?: number;
}

// Cargo Method Selection
export interface CargoMethodSelection {
  shipment_id: number;
  shop_cargo_method_id: number;
}

// Payment Initiation Response
export interface PaymentInitiationResponse {
  payment_url: string;
  order_code: string;
  order_id: number;
}

// Order Note Create Request
export interface OrderNoteCreateRequest {
  order_id: number;
  type?: number;
  description: string;
}

// Order List Params
export interface OrderListParams {
  keyword?: string;
  count?: number;
  paged?: number;
}
