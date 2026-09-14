"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { MouseEvent } from "react";
import Reveal from "./Reveal";
import { useLang } from "@/lib/i18n";

export default function Services({ hideHeader = false }: { hideHeader?: boolean }) {
  const { t } = useLang();
  const items = t.services.items.map((it, i) => ({
    n: String(i + 1).padStart(2, "0"),
    ...it,
  }));

  return (
    <section id="hizmetler" className="relative py-20">
      <div className="container-x">
        {!hideHeader && (
          <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <span className="text-sm font-medium text-accent-2">{t.services.eyebrow}</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t.services.title}
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-muted">{t.services.desc}</p>
            </Reveal>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.n} delay={(i % 3) * 0.08}>
              <Card {...s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({
  n,
  title,
  desc,
  tags,
}: {
  n: string;
  title: string;
  desc: string;
  tags: string[];
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface/50 p-7 transition-colors hover:border-accent/50"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="mb-6 font-mono text-sm text-faint">{n}</div>
      <h3 className="mb-3 text-xl font-medium">{title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-muted">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-border px-3 py-1 text-xs text-faint"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
