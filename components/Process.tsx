"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Reveal from "./Reveal";
import { useLang } from "@/lib/i18n";

export default function Process({ hideHeader = false }: { hideHeader?: boolean }) {
  const { t } = useLang();
  const steps = t.process.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), ...s }));
  const stats = t.stats;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="surec" className="relative py-20">
      <div className="container-x">
        {!hideHeader && (
          <div className="mb-16 text-center">
            <Reveal>
              <span className="text-sm font-medium text-accent-2">{t.process.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                {t.process.title}
              </h2>
            </Reveal>
          </div>
        )}

        <div ref={ref} className="relative grid gap-8 md:grid-cols-4">
          {/* connecting line */}
          <motion.div
            className="absolute left-0 top-8 hidden h-px w-full origin-left bg-gradient-to-r from-accent-3 via-accent to-accent-2 md:block"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.6 }}
              className="relative"
            >
              <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-border bg-surface font-mono text-lg text-accent-2">
                {s.n}
              </div>
              <h3 className="mb-2 text-lg font-medium">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-2 gap-6 rounded-3xl border border-border bg-surface/40 p-10 md:grid-cols-4">
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
