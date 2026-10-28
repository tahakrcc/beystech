import { timingSafeEqual } from "node:crypto";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { appendReply, getRequest, listRequests, setReplyStatus } from "@/lib/contact-store";

export const dynamic = "force-dynamic";

async function authorized(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!expected || !url || !token) return false;
  const provided = request.headers.get("x-admin-token") || "";
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "unknown";
  const redis = new Redis({ url, token });
  const key = `beystech:contact-auth:${ip}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 60);
    if (count > 30) return false;
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  if (!await authorized(request)) return Response.json({ error: "Yetkisiz" }, { status: 401 });
  try {
    return Response.json({ requests: await listRequests() }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Talepler yüklenemedi" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!await authorized(request)) return Response.json({ error: "Yetkisiz" }, { status: 401 });
  let body: { id?: unknown; message?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: "Geçersiz istek" }, { status: 400 }); }
  const id = typeof body.id === "string" ? body.id : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!/^[0-9a-f-]{36}$/i.test(id) || message.length < 1 || message.length > 5000) {
    return Response.json({ error: "Geçersiz yanıt" }, { status: 400 });
  }
  if (!process.env.RESEND_API_KEY) return Response.json({ error: "E-posta servisi yapılandırılmamış" }, { status: 503 });
  try {
    const item = await getRequest(id);
    if (!item) return Response.json({ error: "Talep bulunamadı" }, { status: 404 });
    const replyId = crypto.randomUUID();
    await appendReply(id, { id: replyId, message, sentAt: new Date().toISOString(), status: "pending" });
    const resend = new Resend(process.env.RESEND_API_KEY);
    let deliveryError: boolean;
    try {
      const { error } = await resend.emails.send({
        from: process.env.CUSTOMER_FROM_EMAIL || "BeysTech <info@beystech.com>",
        to: item.email,
        replyTo: process.env.CONTACT_TO_EMAIL || "beystechinfo@gmail.com",
        subject: item.language === "en" ? "Re: Your request — BeysTech" : "Yanıt: Proje talebiniz — BeysTech",
        text: message,
      }, { idempotencyKey: `contact-reply/${replyId}` });
      deliveryError = !!error;
    } catch (error) {
      console.error("Contact reply failed:", error);
      return Response.json({ error: "Gönderim durumu belirsiz; tekrar denemeden önce kontrol edin." }, { status: 502 });
    }
    try {
      await setReplyStatus(id, replyId, deliveryError ? "failed" : "sent");
    } catch (error) {
      console.error("Contact reply status update failed:", error);
      return Response.json({ error: "Gönderim durumu kaydedilemedi; tekrar denemeden önce kontrol edin." }, { status: 503 });
    }
    if (deliveryError) return Response.json({ error: "Yanıt gönderilemedi" }, { status: 502 });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Contact reply storage failed:", error);
    return Response.json({ error: "İşlem tamamlanamadı" }, { status: 503 });
  }
}
