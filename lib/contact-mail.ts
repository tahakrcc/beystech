import "server-only";

export function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function acknowledgementMail(name: string, language: "tr" | "en") {
  const en = language === "en";
  const subject = en ? "We've received your request — BeysTech" : "Talebinizi aldık — BeysTech";
  const greeting = en ? `Hello ${name},` : `Merhaba ${name},`;
  const intro = en ? "Thank you for telling us about your project. Your request has reached our team." : "Projenizi bizimle paylaştığınız için teşekkürler. Talebiniz ekibimize ulaştı.";
  const next = en ? "We'll review the details and get back to you as soon as possible." : "Paylaştığınız detayları inceleyip en kısa sürede sizinle iletişime geçeceğiz.";
  const text = `${greeting}\n\n${intro}\n${next}\n\nBeysTech Ekibi`;
  const html = `<div style="background:#060608;padding:32px 16px;font-family:Arial,sans-serif;color:#f4f5fb"><div style="max-width:560px;margin:auto;background:#101119;border:1px solid #252638;border-radius:20px;overflow:hidden"><div style="height:4px;background:linear-gradient(90deg,#f0abfc,#7c5cff,#22d3ee)"></div><div style="padding:36px"><div style="font-size:22px;font-weight:700;letter-spacing:-1px">beystech<span style="color:#22d3ee">.</span></div><p style="margin:36px 0 12px;color:#a78bfa;font-size:13px;letter-spacing:1px;text-transform:uppercase">${en ? "Request received" : "Talebiniz alındı"}</p><h1 style="font-size:28px;line-height:1.25;margin:0 0 24px">${escapeHtml(greeting)}</h1><p style="color:#c5c7d6;line-height:1.7">${intro}</p><p style="color:#c5c7d6;line-height:1.7">${next}</p><p style="margin-top:32px;color:#f4f5fb">BeysTech ${en ? "Team" : "Ekibi"}</p></div></div></div>`;
  return { subject, text, html };
}
