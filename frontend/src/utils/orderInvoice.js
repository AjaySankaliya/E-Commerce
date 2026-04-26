const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const formatOrderCurrency = (amount) =>
  INR_FORMATTER.format(Number(amount) || 0);

export const getOrderDisplayId = (order) => {
  if (!order?._id) return "ORDER";
  if (!order.paymentId || order.paymentId === "COD") {
    return order._id.slice(-8).toUpperCase();
  }

  return order.paymentId.toUpperCase();
};

export const getCustomerName = (order) => {
  const firstName = order?.userId?.firstName || "";
  const lastName = order?.userId?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Customer";
};

export const getCustomerPhone = (order) => order?.userId?.phoneNo || "Not provided";

export const getShippingAddress = (order) => {
  const savedAddress = [
    order?.userId?.address,
    order?.userId?.city,
    order?.userId?.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  return order?.shippingAddress || savedAddress || "Not provided";
};

export const getPaymentMethod = (order) =>
  order?.paymentId === "COD" ? "Cash on Delivery" : "Online Payment";

export const getPaymentStatusLabel = (order) => {
  if (order?.paymentId === "COD") {
    return order?.status === "Delivered" ? "Paid on delivery" : "Pending on delivery";
  }

  return "Paid";
};

const getLineItems = (order) =>
  (order?.items || []).map((item) => {
    const unitPrice = Number(item?.price ?? item?.productId?.productPrice ?? 0);
    const quantity = Number(item?.quantity || 1);

    return {
      name: item?.productId?.productName || "Product",
      quantity,
      unitPrice,
      total: unitPrice * quantity,
    };
  });

export const buildInvoiceMarkup = (order) => {
  const orderDate = new Date(order?.createdAt || Date.now());
  const lineItems = getLineItems(order);
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const total = Number(order?.totalAmount ?? subtotal);
  const paymentStatus = getPaymentStatusLabel(order);

  const rowsMarkup = lineItems.length
    ? lineItems
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.quantity)}</td>
              <td>${escapeHtml(formatOrderCurrency(item.unitPrice))}</td>
              <td>${escapeHtml(formatOrderCurrency(item.total))}</td>
            </tr>
          `
        )
        .join("")
    : `
      <tr>
        <td colspan="4" style="text-align:center;color:#64748b;padding:20px 16px;">No items available</td>
      </tr>
    `;

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice ${escapeHtml(getOrderDisplayId(order))}</title>
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 20px 16px;
            background: #f8fafc;
            color: #0f172a;
            font-family: "Segoe UI", Arial, sans-serif;
          }
          .invoice {
            max-width: 880px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            padding: 28px;
            box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
          }
          .hero {
            display: flex;
            justify-content: space-between;
            gap: 18px;
            align-items: flex-start;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
            break-inside: avoid;
          }
          .brand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.03em;
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 700;
            background: #dbeafe;
            color: #1d4ed8;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin: 20px 0;
          }
          .card {
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 16px;
            background: #f8fafc;
            break-inside: avoid;
          }
          .eyebrow {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 10px;
          }
          .title {
            font-size: 18px;
            font-weight: 800;
            margin: 0 0 8px;
          }
          .copy {
            margin: 4px 0;
            color: #475569;
            font-size: 14px;
            line-height: 1.6;
            word-break: break-word;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 18px;
            overflow: hidden;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            page-break-inside: auto;
          }
          thead {
            background: #eff6ff;
          }
          th, td {
            padding: 12px 14px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
          }
          th {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #475569;
          }
          tr {
            break-inside: avoid;
          }
          tbody tr:last-child td {
            border-bottom: none;
          }
          .summary {
            margin-top: 18px;
            margin-left: auto;
            width: min(100%, 320px);
            border: 1px solid #dbeafe;
            background: linear-gradient(135deg, #eff6ff, #f8fafc);
            border-radius: 20px;
            padding: 18px;
            break-inside: avoid;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            font-size: 14px;
            color: #334155;
            margin-bottom: 12px;
          }
          .summary-row.total {
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid #bfdbfe;
            font-size: 18px;
            font-weight: 800;
            color: #1d4ed8;
          }
          .footer {
            margin-top: 18px;
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 13px;
            break-inside: avoid;
          }
          @media print {
            body {
              background: #ffffff;
              padding: 0;
              font-size: 12px;
            }
            .invoice {
              box-shadow: none;
              border-radius: 0;
              max-width: none;
              padding: 0;
            }
            .hero { padding-bottom: 14px; }
            .grid { gap: 10px; margin: 14px 0; }
            .card { padding: 12px; border-radius: 14px; }
            .summary { margin-top: 14px; padding: 14px; }
            .footer { display: none; }
          }
          @media (max-width: 640px) {
            .invoice {
              padding: 24px;
            }
            .hero,
            .grid {
              display: block;
            }
            .card {
              margin-bottom: 16px;
            }
            th, td {
              padding: 12px;
            }
          }
        </style>
      </head>
      <body>
        <main class="invoice">
          <section class="hero">
            <div>
              <div class="brand">Store Invoice</div>
              <p class="copy">Invoice for order <strong>#${escapeHtml(getOrderDisplayId(order))}</strong></p>
            </div>
            <div>
              <span class="badge">${escapeHtml(order?.status || "Processing")}</span>
              <p class="copy"><strong>Date:</strong> ${escapeHtml(
                orderDate.toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              )}</p>
              <p class="copy"><strong>Time:</strong> ${escapeHtml(
                orderDate.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              )}</p>
            </div>
          </section>

          <section class="grid">
            <article class="card">
              <p class="eyebrow">Customer</p>
              <h2 class="title">${escapeHtml(getCustomerName(order))}</h2>
              <p class="copy">${escapeHtml(order?.userId?.email || "Not provided")}</p>
              <p class="copy">${escapeHtml(getCustomerPhone(order))}</p>
            </article>
            <article class="card">
              <p class="eyebrow">Shipping Address</p>
              <h2 class="title">Deliver To</h2>
              <p class="copy">${escapeHtml(getShippingAddress(order))}</p>
            </article>
            <article class="card">
              <p class="eyebrow">Payment</p>
              <h2 class="title">${escapeHtml(getPaymentMethod(order))}</h2>
              <p class="copy"><strong>Payment ID:</strong> ${escapeHtml(order?.paymentId || order?._id || "-")}</p>
              <p class="copy"><strong>Status:</strong> ${escapeHtml(paymentStatus)}</p>
            </article>
            <article class="card">
              <p class="eyebrow">Order Reference</p>
              <h2 class="title">#${escapeHtml(getOrderDisplayId(order))}</h2>
              <p class="copy"><strong>Items:</strong> ${escapeHtml(lineItems.length)}</p>
              <p class="copy"><strong>Total:</strong> ${escapeHtml(formatOrderCurrency(total))}</p>
            </article>
          </section>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${rowsMarkup}
            </tbody>
          </table>

          <section class="summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <strong>${escapeHtml(formatOrderCurrency(subtotal))}</strong>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>
            <div class="summary-row">
              <span>Tax</span>
              <strong>Included</strong>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>${escapeHtml(formatOrderCurrency(total))}</span>
            </div>
          </section>

          <footer class="footer">
            This invoice was generated from the admin panel and can be printed or saved for store records.
          </footer>
        </main>
      </body>
    </html>
  `;
};

export const downloadOrderInvoice = (order) => {
  const markup = buildInvoiceMarkup(order);
  const blob = new Blob([markup], { type: "text/html;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `invoice-${getOrderDisplayId(order).toLowerCase()}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};

export const printOrderInvoice = (order) => {
  const printWindow = window.open("", "_blank", "width=960,height=720");

  if (!printWindow) {
    return false;
  }

  printWindow.document.open();
  printWindow.document.write(buildInvoiceMarkup(order));
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    window.setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return true;
};
