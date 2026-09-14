"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Reveal from "./Reveal";
import { useLang } from "@/lib/i18n";
import { useContent } from "@/lib/useContent";
import { workPreview, domainOf } from "@/lib/content-data";

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
    url: w.url,
    preview: workPreview(w),
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
  url,
  preview,
}: {
  title: string;
  cat: string;
  desc: string;
  grad: string;
  year: string;
  index: number;
  url?: string;
  preview: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Wrapper: any = url ? "a" : "div";
  const wrapperProps = url
    ? { href: url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Reveal delay={(index % 2) * 0.1}>
      <Wrapper
        {...wrapperProps}
        ref={ref as never}
        className="group relative block overflow-hidden rounded-3xl border border-border bg-surface/40 transition-colors hover:border-accent/50"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* taban gradyan (görsel yüklenmezse görünür) */}
          <motion.div
            style={{ y }}
            className={`absolute inset-[-15%] bg-gradient-to-br ${grad}`}
          />
          {/* önizleme görseli / site ekran görüntüsü */}
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              style={{ y }}
              src={preview}
              alt={title}
              loading="lazy"
              className="absolute inset-[-15%] h-[130%] w-[130%] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
          {!preview && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-white/20 transition-transform duration-500 group-hover:scale-110">
                {title.charAt(0)}
              </span>
            </div>
          )}
          <span className="absolute right-4 top-4 rounded-full bg-black/30 px-3 py-1 text-xs text-white backdrop-blur">
            {year}
          </span>
          {url && (
            <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
              {domainOf(url)}
              <span className="transition-transform group-hover:translate-x-0.5">↗</span>
            </span>
          )}
        </div>
        <div className="p-7">
          <div className="mb-2 text-xs uppercase tracking-wider text-accent-2">{cat}</div>
          <h3 className="mb-2 text-2xl font-medium">{title}</h3>
          <p className="text-sm leading-relaxed text-muted">{desc}</p>
        </div>
      </Wrapper>
    </Reveal>
  );
}
