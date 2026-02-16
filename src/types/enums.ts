export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned"
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded"
}

export enum DeliveryMethod {
  STANDARD = "standard",
  EXPRESS = "express",
  PICKUP = "pickup"
}

export enum UserRole {
  CUSTOMER = "customer",
  VENDOR = "vendor",
  ADMIN = "admin"
}

export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock"
}
