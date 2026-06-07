const nodemailer = require("nodemailer");

let transporter;
let configurationWarningShown = false;

function getMailConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replaceAll(" ", "");
  const from = process.env.MAIL_FROM?.trim() || user;
  const port = Number.parseInt(process.env.SMTP_PORT, 10) || 587;

  if (!host || !from || Boolean(user) !== Boolean(pass)) {
    return null;
  }

  return {
    from,
    transport: {
      host,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: user && pass ? { user, pass } : undefined,
      disableFileAccess: true,
      disableUrlAccess: true,
    },
  };
}

function getTransporter(config) {
  if (!transporter) {
    transporter = nodemailer.createTransport(config.transport);
  }

  return transporter;
}

async function sendMail(message) {
  const config = getMailConfig();

  if (!config) {
    if (!configurationWarningShown) {
      console.warn(
        "Email notifications are disabled. Configure SMTP_HOST, MAIL_FROM, and both SMTP_USER/SMTP_PASS when authentication is required.",
      );
      configurationWarningShown = true;
    }

    return { sent: false, reason: "not_configured" };
  }

  try {
    const info = await getTransporter(config).sendMail({
      from: config.from,
      ...message,
    });

    console.log(`Email sent to ${message.to}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email delivery failed:", error.message);
    return { sent: false, reason: "delivery_failed" };
  }
}

module.exports = { sendMail };
