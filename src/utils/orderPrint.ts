import { OrderResource } from "@/types/order.types";
import { formatPersianDate, formatPersianPrice, toPersianNumber } from "@/utils/persian";

export const printOrder = (order: OrderResource) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order ${order.code}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { font-size: 24px; margin-bottom: 10px; }
        .info { margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <h1>Order ${order.code}</h1>
      <div class="info">
        <div class="info-row"><span>Customer:</span><span>${order.customer_name}</span></div>
        <div class="info-row"><span>Mobile:</span><span>${order.customer_mobile}</span></div>
        <div class="info-row"><span>Email:</span><span>${order.customer_email || "-"}</span></div>
        <div class="info-row"><span>Status:</span><span>${order.status_label}</span></div>
        <div class="info-row"><span>Date:</span><span>${formatPersianDate(order.created_at)}</span></div>
      </div>
      
      ${order.shipments.map(shipment => `
        <h2>${shipment.shop.title}</h2>
        <p>Shipment: ${shipment.code} - ${shipment.status_label}</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${shipment.items.map(item => `
              <tr>
                <td>${item.sku.title}</td>
                <td>${toPersianNumber(item.quantity)}</td>
                <td>${formatPersianPrice(item.price)}</td>
                <td>${formatPersianPrice(item.price * item.quantity)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `).join("")}
      
      <div class="total">Total: ${formatPersianPrice(order.total_price)} تومان</div>
      
      <button onclick="window.print()">Print</button>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const exportOrderToPDF = async (order: OrderResource) => {
  printOrder(order);
};
