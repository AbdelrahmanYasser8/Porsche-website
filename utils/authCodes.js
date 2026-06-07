const crypto = require("crypto");
const AuthChallenge = require("../models/AuthChallenge");
const { sendMail } = require("./mailer");

const CODE_LIFETIME_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

function createCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashCode(token, code) {
  return crypto
    .createHmac("sha256", process.env.SESSION_SECRET)
    .update(`${token}:${code}`)
    .digest("hex");
}

function codesMatch(actualHash, expectedHash) {
  const actual = Buffer.from(actualHash, "hex");
  const expected = Buffer.from(expectedHash, "hex");

  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function maskEmail(email) {
  const [localPart, domain] = email.split("@");
  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}${"*".repeat(Math.max(2, localPart.length - visible.length))}@${domain}`;
}

async function sendAuthCodeEmail({ email, code, purpose }) {
  const action = purpose === "register" ? "finish creating your account" : "finish signing in";
  const title = purpose === "register" ? "Verify your Porsche account" : "Your Porsche sign-in code";

  return sendMail({
    to: email,
    subject: title,
    text: `Your Porsche verification code is ${code}. It expires in 10 minutes. Do not share this code with anyone.`,
    html: `
      <div style="background:#f3f3f3;padding:32px 16px;font-family:Arial,sans-serif;color:#111">
        <div style="max-width:520px;margin:auto;background:#fff;border-radius:12px;padding:32px">
          <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#666">Porsche account</p>
          <h1 style="margin:0 0 16px;font-size:24px">${title}</h1>
          <p style="margin:0 0 24px;line-height:1.6">Use this code to ${action}:</p>
          <p style="margin:0 0 24px;font-size:34px;font-weight:700;letter-spacing:8px">${code}</p>
          <p style="margin:0;color:#666;line-height:1.6">This code expires in 10 minutes. If you did not request it, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}

function challengeResponse(challenge) {
  return {
    requiresVerification: true,
    challengeToken: challenge.token,
    email: maskEmail(challenge.email),
    expiresIn: Math.ceil((challenge.expiresAt.getTime() - Date.now()) / 1000),
    resendAfter: Math.max(
      0,
      Math.ceil((challenge.lastSentAt.getTime() + RESEND_COOLDOWN_MS - Date.now()) / 1000),
    ),
  };
}

async function createAuthChallenge({ email, purpose, payload }) {
  const existing = await AuthChallenge.findOne({ email, purpose });

  if (existing && existing.expiresAt > new Date()) {
    const retryAfter = Math.ceil(
      (existing.lastSentAt.getTime() + RESEND_COOLDOWN_MS - Date.now()) / 1000,
    );

    if (retryAfter > 0) {
      const error = new Error(`Please wait ${retryAfter} seconds before requesting another code`);
      error.status = 429;
      error.retryAfter = retryAfter;
      throw error;
    }
  }

  await AuthChallenge.deleteOne({ email, purpose });

  const token = crypto.randomBytes(32).toString("hex");
  const code = createCode();
  const now = new Date();
  const challenge = await AuthChallenge.create({
    token,
    email,
    purpose,
    codeHash: hashCode(token, code),
    payload,
    attemptsRemaining: MAX_ATTEMPTS,
    expiresAt: new Date(now.getTime() + CODE_LIFETIME_MS),
    lastSentAt: now,
  });

  const delivery = await sendAuthCodeEmail({ email, code, purpose });
  if (!delivery.sent) {
    await challenge.deleteOne();
    const error = new Error("Unable to send the verification email. Please try again later");
    error.status = 503;
    throw error;
  }

  return challengeResponse(challenge);
}

async function resendAuthChallenge(token) {
  const challenge = await AuthChallenge.findOne({ token });

  if (!challenge || challenge.expiresAt <= new Date()) {
    const error = new Error("This verification request has expired. Please start again");
    error.status = 410;
    throw error;
  }

  const retryAfter = Math.ceil(
    (challenge.lastSentAt.getTime() + RESEND_COOLDOWN_MS - Date.now()) / 1000,
  );
  if (retryAfter > 0) {
    const error = new Error(`Please wait ${retryAfter} seconds before requesting another code`);
    error.status = 429;
    error.retryAfter = retryAfter;
    throw error;
  }

  const code = createCode();
  const now = new Date();
  challenge.codeHash = hashCode(challenge.token, code);
  challenge.attemptsRemaining = MAX_ATTEMPTS;
  challenge.expiresAt = new Date(now.getTime() + CODE_LIFETIME_MS);
  challenge.lastSentAt = now;
  await challenge.save();

  const delivery = await sendAuthCodeEmail({
    email: challenge.email,
    code,
    purpose: challenge.purpose,
  });
  if (!delivery.sent) {
    const error = new Error("Unable to resend the verification email. Please try again later");
    error.status = 503;
    throw error;
  }

  return challengeResponse(challenge);
}

async function consumeAuthChallenge(token, code) {
  const challenge = await AuthChallenge.findOne({ token });

  if (!challenge || challenge.expiresAt <= new Date()) {
    if (challenge) {
      await challenge.deleteOne();
    }

    const error = new Error("This verification code has expired. Please start again");
    error.status = 410;
    throw error;
  }

  if (!/^\d{6}$/.test(code) || !codesMatch(hashCode(token, code), challenge.codeHash)) {
    const updatedChallenge = await AuthChallenge.findOneAndUpdate(
      { _id: challenge._id, attemptsRemaining: { $gt: 1 } },
      { $inc: { attemptsRemaining: -1 } },
      { new: true },
    );

    if (!updatedChallenge) {
      await AuthChallenge.deleteOne({ _id: challenge._id });
      const error = new Error("Too many incorrect attempts. Please start again");
      error.status = 429;
      throw error;
    }

    const error = new Error(
      `Incorrect verification code. ${updatedChallenge.attemptsRemaining} attempts remaining`,
    );
    error.status = 400;
    throw error;
  }

  const result = await AuthChallenge.deleteOne({
    _id: challenge._id,
    codeHash: challenge.codeHash,
  });
  if (result.deletedCount !== 1) {
    const error = new Error("This verification code has already been used");
    error.status = 409;
    throw error;
  }

  return challenge;
}

module.exports = {
  consumeAuthChallenge,
  createAuthChallenge,
  resendAuthChallenge,
};
