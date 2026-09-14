"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { StarBorder } from "./reactbits";
import { useLang } from "@/lib/i18n";

export default function CTABand({
  variant = "default",
}: {
  variant?: "default" | "work" | "team";
}) {
  const { t } = useLang();
  const title = t.cta.titles[variant];

  return (
    <section className="relative overflow-hidden py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/40 px-8 py-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,255,0.18),transparent_60%)]" />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-muted">{t.cta.desc}</p>
            <div className="relative mt-8 flex justify-center">
              <StarBorder
                as={Link}
                href="/iletisim"
                color="var(--accent)"
                speed="5s"
                backgroundColor="#0c0d12"
                textColor="#ffffff"
                borderColor="#2a2c3f"
              >
                {t.cta.button}
              </StarBorder>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
