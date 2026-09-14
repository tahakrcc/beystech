"use client";

import Reveal from "./Reveal";
import { useLang } from "@/lib/i18n";

export default function HomeStats() {
  const { t } = useLang();
  const stats = t.stats;
  return (
    <section className="py-8">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-surface/40 p-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08} className="text-center">
              <div className="text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">
                {s.v}
              </div>
              <div className="mt-2 text-sm text-muted">{s.l}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
