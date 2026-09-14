"use client";

import Reveal from "./Reveal";
import { useLang } from "@/lib/i18n";
import { useContent } from "@/lib/useContent";

export default function Team({ hideHeader = false }: { hideHeader?: boolean }) {
  const { t, lang } = useLang();
  const content = useContent();
  const team = content.team.map((m) => ({
    id: m.id,
    name: m.name[lang],
    role: m.role[lang],
    grad: m.grad,
  }));

  return (
    <section id="ekip" className="relative py-20">
      <div className="container-x">
        {!hideHeader && (
          <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <span className="text-sm font-medium text-accent-2">{t.team.eyebrow}</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t.team.title}
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-muted">{t.team.desc}</p>
            </Reveal>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08}>
              <div className="group overflow-hidden rounded-2xl border border-border bg-surface/40">
                <div className={`aspect-[4/5] bg-gradient-to-br ${m.grad} relative`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.2),transparent_60%)]" />
                  <div className="absolute inset-0 grid place-items-center text-5xl font-bold text-white/25">
                    {m.name.charAt(0)}
                  </div>
                </div>
                <div className="p-5">
                  <div className="font-medium">{m.name}</div>
                  <div className="mt-1 text-sm text-muted">{m.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
