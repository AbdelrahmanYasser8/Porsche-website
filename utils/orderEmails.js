const { sendMail } = require("./mailer");

const STATUS_COLORS = {
  Processing: "#b7791f",
  Completed: "#2f855a",
  Cancelled: "#c53030",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAmount(value) {
  return `$${Number(value || 0).toLocaleString("en-US")}`;
}

function buildOrderHtml(order, heading, message) {
  const statusColor = STATUS_COLORS[order.status] || "#4a5568";

  return `
    <div style="background:#f5f5f5;padding:32px 16px;font-family:Arial,sans-serif;color:#171717">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5">
        <div style="background:#111;color:#fff;padding:24px 28px">
          <div style="font-size:13px;letter-spacing:3px;text-transform:uppercase">Porsche</div>
          <h1 style="font-size:24px;margin:10px 0 0">${escapeHtml(heading)}</h1>
        </div>
        <div style="padding:28px">
          <p style="margin:0 0 18px">Hello ${escapeHtml(order.customer)},</p>
          <p style="margin:0 0 24px;line-height:1.6">${escapeHtml(message)}</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;color:#666">Order</td><td style="padding:10px 0;text-align:right;font-weight:700">${escapeHtml(order.id)}</td></tr>
            <tr><td style="padding:10px 0;color:#666">Vehicle</td><td style="padding:10px 0;text-align:right;font-weight:700">${escapeHtml(order.product)}</td></tr>
            <tr><td style="padding:10px 0;color:#666">Amount</td><td style="padding:10px 0;text-align:right;font-weight:700">${escapeHtml(formatAmount(order.amount))}</td></tr>
            <tr><td style="padding:10px 0;color:#666">Status</td><td style="padding:10px 0;text-align:right"><span style="display:inline-block;padding:6px 12px;border-radius:999px;background:${statusColor};color:#fff;font-weight:700">${escapeHtml(order.status)}</span></td></tr>
          </table>
          <p style="margin:24px 0 0;color:#666;font-size:13px;line-height:1.5">This is an automated order notification. Please keep this email for your records.</p>
        </div>
      </div>
    </div>
  `;
}

function buildOrderText(order, heading, message) {
  return [
    heading,
    "",
    `Hello ${order.customer},`,
    message,
    "",
    `Order: ${order.id}`,
    `Vehicle: ${order.product}`,
    `Amount: ${formatAmount(order.amount)}`,
    `Status: ${order.status}`,
  ].join("\n");
}

function sendOrderPlacedEmail(order) {
  const heading = "We received your order";
  const message = `Your order has been placed successfully and is currently ${order.status.toLowerCase()}.`;

  return sendMail({
    to: order.email,
    subject: `Order ${order.id} received`,
    text: buildOrderText(order, heading, message),
    html: buildOrderHtml(order, heading, message),
  });
}

function sendOrderStatusEmail(order) {
  const heading = "Your order status changed";
  const message = `The status of your order is now ${order.status}.`;

  return sendMail({
    to: order.email,
    subject: `Order ${order.id} status: ${order.status}`,
    text: buildOrderText(order, heading, message),
    html: buildOrderHtml(order, heading, message),
  });
}

module.exports = {
  sendOrderPlacedEmail,
  sendOrderStatusEmail,
};
