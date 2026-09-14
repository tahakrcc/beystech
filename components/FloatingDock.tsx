"use client";

import { motion } from "motion/react";
import { useLang } from "@/lib/i18n";

/**
 * Sayfayla birlikte kayan (sabit) alt aksiyon paneli.
 * Sol: WhatsApp mesajı · Orta: Ara (telefon) · Sağ: E-posta gönder.
 *
 * NOT: Aşağıdaki iletişim bilgileri PLACEHOLDER'dır — gerçek numara/e-posta ile değiştirin.
 */
const PHONE = "+905555555555"; // tel: için
const WHATSAPP = "905555555555"; // wa.me/ için (başında + yok)
const EMAIL = "merhaba@beystech.com";

export default function FloatingDock() {
  const { t } = useLang();
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="relative">
        {/* Dönen renkli glow — sürekli hareket eden çerçeve ışığı */}
        <div className="pointer-events-none absolute -inset-[2px] overflow-hidden rounded-full">
          <div
            className="dock-glow absolute left-1/2 top-1/2 h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2 opacity-70"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, var(--accent-3) 60deg, var(--accent) 140deg, var(--accent-2) 220deg, transparent 300deg)",
            }}
          />
        </div>

        <div className="relative flex items-center gap-2 rounded-full border border-border bg-bg-soft/85 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
          {/* Sol: Mesaj (WhatsApp) */}
          <DockButton
            href={`https://wa.me/${WHATSAPP}`}
            external
            label={t.dock.message}
          >
            <ChatIcon />
          </DockButton>

          {/* Orta: Ara — düz renk zemin + çağrı dalgaları */}
          <a
            href={`tel:${PHONE}`}
            aria-label={t.dock.call}
            style={{ background: "var(--accent)" }}
            className="group relative flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-transform hover:scale-105"
          >
            {/* çağrı dalgaları */}
            <span className="call-ring pointer-events-none absolute inset-0 rounded-full border border-accent" />
            <span
              className="call-ring pointer-events-none absolute inset-0 rounded-full border border-accent-2"
              style={{ animationDelay: "1.1s" }}
            />
            <PhoneIcon />
            <span className="relative text-sm">{t.dock.call}</span>
          </a>

          {/* Sağ: Mail */}
          <DockButton href={`mailto:${EMAIL}`} label={t.dock.mail}>
            <MailIcon />
          </DockButton>
        </div>
      </div>
    </motion.div>
  );
}

function DockButton({
  href,
  label,
  external,
  className = "",
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`grid h-12 w-12 place-items-center rounded-full border border-border bg-surface/70 text-muted transition-all hover:scale-105 hover:border-accent/50 hover:text-text ${className}`}
    >
      {children}
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
