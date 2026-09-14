"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Reveal from "./Reveal";
import { useLang } from "@/lib/i18n";
import { useContent } from "@/lib/useContent";

export default function Work({ hideHeader = false }: { hideHeader?: boolean }) {
  const { t, lang } = useLang();
  const content = useContent();
  const projects = content.works.map((w) => ({
    id: w.id,
    title: w.title[lang],
    cat: w.cat[lang],
    desc: w.desc[lang],
    grad: w.grad,
    year: w.year,
  }));

  return (
    <section id="isler" className="relative py-20">
      <div className="container-x">
        {!hideHeader && (
          <div className="mb-16">
            <Reveal>
              <span className="text-sm font-medium text-accent-2">{t.work.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                {t.work.title}
              </h2>
            </Reveal>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  title,
  cat,
  desc,
  grad,
  year,
  index,
}: {
  title: string;
  cat: string;
  desc: string;
  grad: string;
  year: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <Reveal delay={(index % 2) * 0.1}>
      <div
        ref={ref}
        className="group relative overflow-hidden rounded-3xl border border-border bg-surface/40"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.div
            style={{ y }}
            className={`absolute inset-[-15%] bg-gradient-to-br ${grad}`}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white/20 transition-transform duration-500 group-hover:scale-110">
              {title.charAt(0)}
            </span>
          </div>
          <span className="absolute right-4 top-4 rounded-full bg-black/30 px-3 py-1 text-xs text-white backdrop-blur">
            {year}
          </span>
        </div>
        <div className="p-7">
          <div className="mb-2 text-xs uppercase tracking-wider text-accent-2">{cat}</div>
          <h3 className="mb-2 text-2xl font-medium">{title}</h3>
          <p className="text-sm leading-relaxed text-muted">{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}
