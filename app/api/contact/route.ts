import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { acknowledgementMail, escapeHtml } from "@/lib/contact-mail";
import { saveRequest, setDeliveryStatus } from "@/lib/contact-store";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;
const RATE_LIMIT_MAX_REQUESTS = 5;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown;
  language?: unknown;
};

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured.");
    return Response.json({ error: "Mail service is not configured." }, { status: 503 });
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = stringValue(payload.name);
  const email = stringValue(payload.email).toLowerCase();
  const company = stringValue(payload.company);
  const message = stringValue(payload.message);
  const website = stringValue(payload.website);
  const language = payload.language === "en" ? "en" : "tr";

  // Honeypot: bots often fill hidden fields. Return success without sending.
  if (website) {
    return Response.json({ ok: true });
  }

  if (
    name.length < 2 ||
    name.length > 100 ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    company.length > 120 ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return Response.json({ error: "Please check the form fields." }, { status: 400 });
  }

  if (await isRateLimited(request)) {
    return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const from = process.env.RESEND_FROM_EMAIL || "BeysTech <info@beystech.com>";
  const to = process.env.CONTACT_TO_EMAIL || "info@beystech.com";
  const resend = new Resend(apiKey);
  const id = crypto.randomUUID();
  try {
    await saveRequest({ id, name, email, company, message, language, createdAt: new Date().toISOString(), acknowledgement: "pending", notification: "pending", replies: [] });
  } catch (error) {
    console.error("Contact storage failed:", error);
    return Response.json({ error: "Request could not be saved." }, { status: 503 });
  }
  const subject = `Yeni proje talebi: ${(company || name).replace(/[\r\n]+/g, " ")}`;
  const text = [
    `Ad Soyad: ${name}`,
    `E-posta: ${email}`,
    `Şirket: ${company || "Belirtilmedi"}`,
    "",
    "Proje:",
    message,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html: contactEmailHtml({ name, email, company, message }),
    });

    if (error) {
      console.error("Resend contact email error:", error);
      await setDeliveryStatus(id, "notification", "failed");
    } else {
      await setDeliveryStatus(id, "notification", "sent");
    }
  } catch (error) {
    console.error("Resend contact email request failed:", error);
    await setDeliveryStatus(id, "notification", "failed").catch(console.error);
  }

  try {
    const result = await resend.emails.send({ from: process.env.CUSTOMER_FROM_EMAIL || "BeysTech <info@beystech.com>", to: email, replyTo: to, ...acknowledgementMail(name, language) });
    if (result.error) console.error("Contact acknowledgement failed:", result.error);
    await setDeliveryStatus(id, "acknowledgement", result.error ? "failed" : "sent");
  } catch (error) {
    console.error("Contact acknowledgement request failed:", error);
    await setDeliveryStatus(id, "acknowledgement", "failed").catch(console.error);
  }

  return Response.json({ ok: true });
}
function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
async function isRateLimited(request: Request) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return false;

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const key = `contact-rate:${ip}`;

  try {
    const redis = new Redis({ url, token });
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    return count > RATE_LIMIT_MAX_REQUESTS;
  } catch (error) {
    console.error("Contact rate limit check failed:", error);
    return true;
  }
}

function contactEmailHtml({
  name,
  email,
  company,
  message,
}: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111827">
      <h1 style="font-size:24px;margin:0 0 24px">Yeni proje talebi</h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr><td style="padding:8px 0;color:#6b7280">Ad Soyad</td><td style="padding:8px 0">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">E-posta</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Şirket</td><td style="padding:8px 0">${escapeHtml(company || "Belirtilmedi")}</td></tr>
      </table>
      <h2 style="font-size:16px;margin:0 0 8px">Proje</h2>
      <div style="white-space:pre-wrap;line-height:1.6;padding:16px;background:#f3f4f6;border-radius:12px">${escapeHtml(message)}</div>
    </div>
  `;
}
