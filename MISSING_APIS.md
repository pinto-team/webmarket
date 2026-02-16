# Missing APIs for Checkout Flow

Based on screenshot analysis and current Taavoni API.

## 1. Shipping Cost Calculation ❌

**Current**: Not available
**Needed**: Calculate shipping cost based on address, weight, delivery method

```
GET /shipping/calculate
Query: address_id, cart_items[], delivery_method
Response: {
  cost: number,
  estimated_days: number
}
```

**Alternative**: Add to SKU or set fixed/free shipping

---

## 2. Delivery Date Selection ❌

**Current**: Only `SKU.delivery` (number of days)
**Needed**: Available delivery dates (not time slots, just dates)

```
GET /delivery/dates
Query: address_id, cart_items[]
Response: {
  dates: [
    { date: "2024-12-19", available: true },
    { date: "2024-12-20", available: true },
    { date: "2024-12-21", available: false }
  ]
}
```

**Alternative**: Calculate dates from `SKU.delivery` field (e.g., delivery=7 means 7 days from now)

---

## 3. Order Summary Before Checkout ❌

**Current**: Must create order to see total
**Needed**: Calculate order total before creating order

```
POST /orders/calculate
Body: {
  cart_items: [{sku_id, quantity}],
  address_id: number,
  delivery_date?: string
}
Response: {
  items_total: number,
  shipping_cost: number,
  insurance_cost: number,
  discount: number,
  tax: number,
  total: number
}
```

**Alternative**: Calculate on frontend from cart items

---

## 4. Payment Type per SKU ❌

**Current**: SKU doesn't have payment type
**Needed**: Know which SKUs support installment

```typescript
// Add to SkuResource
{
  payment_types: ["immediate", "installment"],
  installment_months?: number,
  installment_amount?: number
}
```

---

## 5. Installment Plans ❌

**Current**: Not available
**Needed**: Available installment options

```
GET /installment/plans
Query: amount
Response: {
  plans: [
    { months: 3, monthly_amount: 3333333, total: 10000000 },
    { months: 6, monthly_amount: 1666666, total: 10000000 },
    { months: 12, monthly_amount: 833333, total: 10000000 }
  ]
}
```

---

## 6. Wallet Operations ❌

**Current**: User has `wallet.balance` but no operations
**Needed**: Use wallet for payment

```
POST /wallet/pay
Body: {
  order_id: number,
  amount: number
}
Response: {
  success: boolean,
  remaining_balance: number
}
```

---

## 7. Discount Code Validation ❌

**Current**: Not available
**Needed**: Apply and validate discount codes

```
POST /discounts/validate
Body: {
  code: string,
  cart_items: [{sku_id, quantity}]
}
Response: {
  valid: boolean,
  discount_amount: number,
  discount_percent: number
}
```

---

## 8. Insurance Option ❌

**Current**: Not available
**Needed**: Optional insurance for products

```typescript
// Add to order creation
{
  insurance: boolean,
  insurance_cost?: number
}
```

---

## 9. Payment Gateway Redirect URL ❌

**Current**: `GET /gateways` returns list but no payment URL
**Needed**: Get payment URL after order creation

```
POST /payments/initiate
Body: {
  order_id: number,
  gateway_id: number
}
Response: {
  payment_url: string,
  transaction_id: string
}
```

---

## 10. Payment Callback Verification ❌

**Current**: Not documented
**Needed**: Verify payment after gateway callback

```
POST /payments/verify
Body: {
  transaction_id: string,
  status: string,
  reference_id: string
}
Response: {
  success: boolean,
  order_id: number,
  payment_status: string
}
```

---

## Priority Classification

### 🔴 Critical (Must Have)
1. **Shipping cost calculation** - Or set to free
2. **Order total calculation** - Or calculate on frontend
3. **Payment gateway redirect** - Required for payment
4. **Payment verification** - Required for order completion

### 🟡 Important (Should Have)
5. **Delivery date selection** - Or use SKU.delivery estimate
6. **Discount codes** - Can skip for MVP
7. **Wallet payment** - Can skip for MVP

### 🟢 Nice to Have (Can Skip)
8. **Payment types per SKU** - Can show all as immediate
9. **Installment plans** - Can skip for MVP
10. **Insurance option** - Can skip for MVP

---

## Workarounds for MVP

### 1. Shipping Cost
```typescript
// Set to free or fixed amount
const shippingCost = 0; // Free shipping
```

### 2. Delivery Date
```typescript
// Calculate from SKU.delivery
const deliveryDate = new Date();
deliveryDate.setDate(deliveryDate.getDate() + sku.delivery);
```

### 3. Order Total
```typescript
// Calculate on frontend
const total = cartItems.reduce((sum, item) => 
  sum + (item.sku.price * item.quantity), 0
);
```

### 4. Payment Flow
```typescript
// After order creation, redirect to gateway
const orderId = await orderService.checkout(data);
// Assume gateway URL format
window.location.href = `${gateway.url}?order=${orderId}`;
```

---

## Questions for Backend Team

1. **Shipping**: Free shipping or calculated? If calculated, how?
2. **Delivery dates**: Can we get available dates or just use SKU.delivery?
3. **Payment**: What's the payment gateway integration flow?
4. **Installment**: Is it supported? How to check eligibility?
5. **Wallet**: Can users pay with wallet balance?
6. **Discounts**: Are discount codes supported?
7. **Insurance**: Is product insurance optional?
8. **Order total**: Can we get total before creating order?

---

## Recommended MVP Flow (Without Missing APIs)

1. **Cart** → Show items, calculate total on frontend
2. **Address** → Select/add address (✅ API available)
3. **Review** → Show order summary with estimated delivery
4. **Payment** → Create order, redirect to gateway
5. **Confirmation** → Show order details

**Skip for MVP**:
- Delivery date selection
- Installment payment
- Wallet payment
- Discount codes
- Insurance option
