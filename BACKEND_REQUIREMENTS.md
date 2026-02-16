# Backend API Requirements

## 1. Payment Type for SKUs (Critical) 🔴

### Current
```json
{
  "id": 1,
  "price": 10000000,
  "stock": 5,
  "delivery": 7
}
```

### Needed
```json
{
  "id": 1,
  "price": 10000000,
  "stock": 5,
  "delivery": 7,
  "payment_type": "immediate",
  "installment_available": false
}
```

Or for installment:
```json
{
  "id": 2,
  "price": 10000000,
  "stock": 5,
  "delivery": 7,
  "payment_type": "installment",
  "installment_available": true,
  "installment_months": 18,
  "installment_monthly": 555555
}
```

### Why Needed
To group sellers by payment type like screenshot:
- همه فروشندهها (All Sellers)
- فروشندگان طرف قرارداد اقساطی (Installment Sellers)

---

## 2. Shipping Cost Calculation 🔴

### Needed
```
GET /shipping/calculate?address_id=1&cart_items[]=1&cart_items[]=2
```

Response:
```json
{
  "success": true,
  "data": {
    "cost": 89000,
    "estimated_days": 3
  }
}
```

### Alternative
Add fixed shipping cost to order or set free shipping.

---

## 3. Order Total Calculation 🔴

### Needed
```
POST /orders/calculate
```

Body:
```json
{
  "cart_items": [
    {"sku_id": 1, "quantity": 2},
    {"sku_id": 2, "quantity": 1}
  ],
  "address_id": 1
}
```

Response:
```json
{
  "success": true,
  "data": {
    "items_total": 30000000,
    "shipping_cost": 89000,
    "discount": 0,
    "tax": 0,
    "total": 30089000
  }
}
```

### Why Needed
Show order summary before creating order.

---

## 4. Payment Gateway Integration 🔴

### Needed
```
POST /payments/initiate
```

Body:
```json
{
  "order_id": 123,
  "gateway_id": 1
}
```

Response:
```json
{
  "success": true,
  "data": {
    "payment_url": "https://gateway.com/pay?token=xxx",
    "transaction_id": "TXN123456"
  }
}
```

### Payment Callback
```
POST /payments/verify
```

Body:
```json
{
  "transaction_id": "TXN123456",
  "status": "success",
  "reference_id": "REF789"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "payment_status": "paid"
  }
}
```

---

## 5. Delivery Date Selection 🟡

### Needed
```
GET /delivery/dates?address_id=1
```

Response:
```json
{
  "success": true,
  "data": {
    "dates": [
      {"date": "2024-12-19", "available": true},
      {"date": "2024-12-20", "available": true},
      {"date": "2024-12-21", "available": false},
      {"date": "2024-12-22", "available": true}
    ]
  }
}
```

### Why Needed
User selects delivery date (not time slot, just date).

### Alternative
Calculate from `SKU.delivery` field on frontend.

---

## 6. Discount Code Validation 🟡

### Needed
```
POST /discounts/validate
```

Body:
```json
{
  "code": "SUMMER2024",
  "cart_items": [
    {"sku_id": 1, "quantity": 2}
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "valid": true,
    "discount_amount": 2000000,
    "discount_percent": 10
  }
}
```

---

## 7. Wallet Payment 🟡

### Current
User has `wallet.balance` but can't use it.

### Needed
```
POST /wallet/pay
```

Body:
```json
{
  "order_id": 123,
  "amount": 5000000
}
```

Response:
```json
{
  "success": true,
  "data": {
    "paid_amount": 5000000,
    "remaining_balance": 0,
    "remaining_order_amount": 5000000
  }
}
```

---

## 8. Insurance Option 🟢

### Needed
Add to order creation:
```json
{
  "address_id": 1,
  "customer_name": "John",
  "customer_mobile": "09123456789",
  "customer_email": "john@example.com",
  "insurance": true
}
```

Response should include:
```json
{
  "insurance_cost": 350000
}
```

---

## Priority Summary

### 🔴 Critical (Block Checkout)
1. **Payment gateway integration** - Can't complete orders without this
2. **Payment type for SKUs** - Can't show installment sellers
3. **Shipping cost** - Or confirm it's free
4. **Order total calculation** - Or we calculate on frontend

### 🟡 Important (Can Work Around)
5. **Delivery date selection** - Can use SKU.delivery estimate
6. **Discount codes** - Can skip for MVP
7. **Wallet payment** - Can skip for MVP

### 🟢 Nice to Have
8. **Insurance option** - Can skip

---

## Questions

1. **Payment**: What payment gateway are you using? How does redirect work?
2. **Shipping**: Is shipping free or calculated? If calculated, how?
3. **Installment**: Is installment payment supported? Which providers?
4. **Delivery dates**: Can you provide available delivery dates?
5. **Discounts**: Are discount codes supported?
6. **Wallet**: Can users pay with wallet balance?
7. **Insurance**: Is product insurance optional?
8. **Order total**: Can we get total before creating order?

---

## Current Workarounds

Until APIs are ready, we will:
- ✅ Show all sellers (no payment type grouping)
- ✅ Set shipping to free (0 تومان)
- ✅ Calculate order total on frontend
- ✅ Skip delivery date selection
- ✅ Skip discount codes
- ✅ Skip wallet payment
- ✅ Skip insurance option
- ⏳ Wait for payment gateway integration

---

## Timeline

**Phase 1** (Can do now):
- Cart page
- Address management
- Basic checkout (create order)

**Phase 2** (Need APIs):
- Payment integration
- Installment sellers grouping
- Delivery date selection
- Discount codes
- Wallet payment
