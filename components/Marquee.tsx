"use client";

import { useLang } from "@/lib/i18n";

export default function Marquee() {
  const { t } = useLang();
  const items = t.marquee.items;
  return (
    <section className="border-y border-border bg-bg-soft/40 py-8">
      <div className="mb-5 text-center text-xs uppercase tracking-[0.2em] text-faint">
        {t.marquee.title}
      </div>
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex shrink-0 animate-marquee items-center gap-4 pr-4">
          {[...items, ...items].map((it, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full border border-border bg-surface/60 px-5 py-2 text-sm text-muted"
            >
              {it}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
