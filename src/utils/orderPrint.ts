import { OrderResource } from "@/types/order.types";
import {
    formatPersianDate,
    formatPersianPrice,
    toPersianNumber
} from "@/utils/persian";

const escapeHtml = (str: string | undefined | null) => {
    if (!str) return "-";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export const printOrder = (order: OrderResource) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>سفارش ${toPersianNumber(String(order.code))}</title>
      <style>
        body {
          font-family: Tahoma, Arial, sans-serif;
          padding: 24px;
          direction: rtl;
          background: #fff;
        }
        h1 { font-size: 22px; margin-bottom: 16px; }
        h2 { font-size: 18px; margin-top: 24px; }
        .info { margin: 16px 0; }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 6px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          text-align: left;
          margin-top: 24px;
        }
        button {
          margin-top: 20px;
          padding: 8px 16px;
          cursor: pointer;
        }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>

      <h1>سفارش شماره ${toPersianNumber(String(order.code))}</h1>

      <div class="info">
        <div class="info-row"><span>نام مشتری:</span><span>${escapeHtml(order.customer_name)}</span></div>
        <div class="info-row"><span>موبایل:</span><span>${toPersianNumber(order.customer_mobile)}</span></div>
        <div class="info-row"><span>ایمیل:</span><span>${escapeHtml(order.customer_email)}</span></div>
        <div class="info-row"><span>وضعیت:</span><span>${escapeHtml(order.status_label)}</span></div>
        <div class="info-row"><span>تاریخ ثبت:</span><span>${formatPersianDate(order.created_at)}</span></div>
      </div>

      ${order.shipments
        .map(
            (shipment) => `
        <h2>${escapeHtml(shipment.shop.title)}</h2>
        <div>کد مرسوله: ${escapeHtml(shipment.code)} — ${escapeHtml(shipment.status_label)}</div>

        <table>
          <thead>
            <tr>
              <th>کالا</th>
              <th>تعداد</th>
              <th>قیمت واحد</th>
              <th>جمع</th>
            </tr>
          </thead>
          <tbody>
            ${shipment.items
                .map(
                    (item) => `
              <tr>
                <td>${escapeHtml(item.sku.title)}</td>
                <td>${toPersianNumber(item.quantity)}</td>
                <td>${formatPersianPrice(item.price)}</td>
                <td>${formatPersianPrice(item.price * item.quantity)}</td>
              </tr>
            `
                )
                .join("")}
          </tbody>
        </table>
      `
        )
        .join("")}

      <div class="total">
        مبلغ کل: ${formatPersianPrice(order.total_price)} تومان
      </div>

      <button onclick="window.print()">چاپ سفارش</button>

    </body>
    </html>
  `;

    printWindow.document.write(html);
    printWindow.document.close();
};

export const exportOrderToPDF = async (order: OrderResource) => {
    printOrder(order);
};
