"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Aurora, RotatingText, ShinyText } from "./reactbits";
import { useLang } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-28"
    >
      {/* ReactBits Aurora background */}
      <div className="absolute inset-0 opacity-70">
        <Aurora colorStops={["#7c5cff", "#22d3ee", "#f0abfc"]} amplitude={1.1} blend={0.6} speed={0.8} />
      </div>
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />

      <motion.div style={{ y, opacity }} className="container-x relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-2 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2" />
          </span>
          <ShinyText text={t.hero.badge} speed={4} className="text-xs" />
        </motion.div>

        <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            {t.hero.line1}
          </motion.span>
          <span className="mt-2 flex flex-wrap items-center justify-center gap-x-4">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {t.hero.we}
            </motion.span>
            <RotatingText
              key={t.hero.rotating.join("|")}
              texts={t.hero.rotating}
              mainClassName="inline-flex"
              elementLevelClassName="text-gradient"
              rotationInterval={2200}
              staggerDuration={0.02}
              staggerFrom="first"
              splitLevelClassName="overflow-hidden pb-1"
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mx-auto mt-7 max-w-xl text-base text-muted sm:text-lg"
        >
          {t.hero.desc}
        </motion.p>

      </motion.div>

      <motion.div
        aria-hidden
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-border p-1.5">
          <div className="h-2 w-1 rounded-full bg-muted" />
        </div>
      </motion.div>
    </section>
  );
}
