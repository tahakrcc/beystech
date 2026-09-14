"use client";

import { motion } from "motion/react";
import { BlurText } from "./reactbits";
import { useLang } from "@/lib/i18n";

export default function PageHeader({
  page,
}: {
  page: "services" | "work" | "team" | "contact";
}) {
  const { t } = useLang();
  const { eyebrow, title, desc } = t.pages[page];

  return (
    <header className="relative overflow-hidden pt-40 pb-16">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)", opacity: 0.25 }}
      />
      <div className="container-x relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-accent-2"
        >
          {eyebrow}
        </motion.span>
        <BlurText
          key={title}
          text={title}
          delay={90}
          animateBy="words"
          className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
        />
        {desc && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 max-w-xl text-lg text-muted"
          >
            {desc}
          </motion.p>
        )}
      </div>
    </header>
  );
}
