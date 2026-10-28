"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactRequest } from "@/lib/contact-data";

export default function ContactRequests({ token }: { token: string }) {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/requests", { headers: { "x-admin-token": token }, cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json() as { requests: ContactRequest[] };
      setItems(data.requests);
      setError("");
    } catch {
      setError("Talepler yüklenemedi. Bağlantıyı ve admin ayarlarını kontrol edin.");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { Promise.resolve().then(load); }, [load]);

  async function sendReply(id: string) {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/requests", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": token }, body: JSON.stringify({ id, message: draft }) });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || "Yanıt gönderilemedi.");
      setDraft("");
      await load();
    } catch (e) {
      await load();
      setError(e instanceof Error ? e.message : "Yanıt gönderilemedi.");
    } finally { setSending(false); }
  }

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div><h2 className="text-2xl font-semibold">Gelen talepler</h2><p className="mt-1 text-sm text-muted">Son 100 form başvurusu ve gönderilen yanıtlar</p></div>
        <button type="button" onClick={() => void load()} className="rounded-lg border border-border px-3 py-2 text-sm">Yenile</button>
      </div>
      {error && <p role="alert" className="mb-4 text-sm text-rose-400">{error}</p>}
      {loading ? <p className="text-sm text-muted">Yükleniyor…</p> : items.length === 0 ? <p className="rounded-2xl border border-border p-5 text-sm text-muted">Henüz talep yok. Yeni başvurular burada görünür.</p> : (
        <div className="space-y-3">{items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-border bg-surface/40 p-5">
            <button type="button" onClick={() => { setOpen(open === item.id ? null : item.id); setDraft(""); }} aria-expanded={open === item.id} className="flex w-full items-start justify-between gap-4 text-left">
              <span><span className="block font-medium">{item.name}{item.company ? ` · ${item.company}` : ""}</span><span className="mt-1 block text-sm text-muted">{item.email} · {new Date(item.createdAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })}</span></span>
              <span className="shrink-0 rounded-full bg-accent/15 px-3 py-1 text-xs text-accent-2">{item.replies?.some((r) => r.status === "sent") ? "Yanıtlandı" : "Yeni"}</span>
            </button>
            {open === item.id && <div className="mt-5 space-y-4 border-t border-border pt-4">
              {item.phone && <p className="text-sm text-muted">Telefon: <a href={`tel:${item.phone}`} className="text-accent-2 hover:underline">{item.phone}</a></p>}
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">{item.message}</p>
              <p className="text-xs text-muted">Alındı e-postası: {item.acknowledgement === "sent" ? "gönderildi" : item.acknowledgement === "failed" ? "gönderilemedi" : "beklemede"} · Bildirim: {item.notification === "sent" ? "gönderildi" : item.notification === "failed" ? "gönderilemedi" : "beklemede"}</p>
              {(item.replies || []).map((reply) => <div key={reply.id} className="rounded-xl border border-border bg-bg-soft p-4 text-sm"><div className="mb-2 text-xs text-muted">{new Date(reply.sentAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })} · {reply.status === "sent" ? "Gönderildi" : reply.status === "failed" ? "Gönderilemedi" : "Durumu kontrol edilmeli"}</div><p className="whitespace-pre-wrap">{reply.message}</p></div>)}
              <form onSubmit={(e) => { e.preventDefault(); void sendReply(item.id); }} className="space-y-3"><label className="block text-sm text-muted" htmlFor={`reply-${item.id}`}>Yanıtınız</label><textarea id={`reply-${item.id}`} value={draft} onChange={(e) => setDraft(e.target.value)} required maxLength={5000} rows={4} className="w-full rounded-xl border border-border bg-bg-soft p-3 text-text outline-none focus:border-accent" /><button disabled={sending || !draft.trim()} className="rounded-xl bg-text px-5 py-2.5 text-sm font-medium text-black disabled:opacity-50">{sending ? "Gönderiliyor…" : "Yanıtı gönder"}</button></form>
            </div>}
          </article>
        ))}</div>
      )}
    </section>
  );
}
